// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, RefreshControl, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { categories } from '../components/CategorySelector';
import BillCard from '../components/BillCard';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [payments, setPayments] = useState({
    unpaidBills: [],
    createdBills: [],
    receivedBills: [], 
    pastBills: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'unpaid', title: 'Unpaid' },
    { key: 'created', title: 'Created' },
    { key: 'received', title: 'Received' },
    { key: 'past', title: 'Past' },
  ]);
  
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const fetchPayments = async () => {
    if (!currentUser) return;
    
    try {
      const snapshot = await db.collection('payments')
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get();
      
      const paymentsPromises = snapshot.docs.map(async doc => {
        const payment = doc.data();
        
        const billDoc = await db.collection('bills').doc(payment.billId).get();
        const billData = billDoc.data();
        
        const allPaymentsSnapshot = await db.collection('payments')
          .where('billId', '==', payment.billId)
          .get();
        
        const totalPending = allPaymentsSnapshot.docs.reduce((sum, payDoc) => {
          const payData = payDoc.data();
          return payData.status === 'pending' ? sum + payData.amount : sum;
        }, 0);
        
        const creatorDoc = await db.collection('users').doc(billData.createdBy).get();
        const creatorData = creatorDoc.data();

        return {
          id: doc.id,
          ...payment,
          billId: payment.billId,
          billAmount: billData.amount,
          billTitle: billData.title || 'Untitled Bill',
          billDescription: billData.description || '',
          category: billData.category || 'other',
          createdBy: billData.createdBy,
          creatorName: billData.createdBy === currentUser.uid ? 'You' : (creatorData.displayName || creatorData.email),
          createdAt: billData.createdAt?.toDate() || new Date(),
          totalPending,
          isCreator: billData.createdBy === currentUser.uid
        };
      });

      const paymentsData = await Promise.all(paymentsPromises);
      
      const unpaidBills = paymentsData
        .filter(payment => 
          (!payment.isCreator && payment.status === 'pending') ||
          (payment.isCreator && payment.totalPending > 0)
        )
        .sort((a, b) => b.createdAt - a.createdAt);

      const createdBills = paymentsData
        .filter(payment => 
          payment.isCreator && payment.totalPending === 0
        )
        .sort((a, b) => b.createdAt - a.createdAt);

      const receivedBills = paymentsData
        .filter(payment => 
          !payment.isCreator && payment.status === 'paid'
        )
        .sort((a, b) => b.createdAt - a.createdAt);

      const pastBills = paymentsData
        .filter(payment => 
          (payment.isCreator && payment.totalPending === 0) || 
          (!payment.isCreator && payment.status === 'paid')
        )
        .sort((a, b) => b.createdAt - a.createdAt);
      
      setPayments({
        unpaidBills,
        createdBills,
        receivedBills,
        pastBills
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
  
    setUserEmail(currentUser.email);
  
    const unsubscribe = db.collection('payments')
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(async () => {
        await fetchPayments();
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  }, []);

  const handlePayment = async (paymentId) => {
    try {
      await db.collection('payments').doc(paymentId).update({
        status: 'paid',
        paidAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      Alert.alert('Error', 'Failed to update payment status');
    }
  };

  const renderBillList = (bills) => {
    return (
      <FlatList
        data={bills}
        renderItem={({ item }) => (
          <BillCard
            item={item}
            currentUser={currentUser}
            onPress={() => navigation.navigate('BillDetails', { billId: item.billId })}
            onPaymentPress={handlePayment}
          />
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#34C759"
            colors={['#34C759']}
          />
        }
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No bills found</Text>
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  const UnpaidBills = () => renderBillList(payments.unpaidBills || []);
  const CreatedBills = () => renderBillList(payments.createdBills || []);
  const ReceivedBills = () => renderBillList(payments.receivedBills || []);
  const PastBills = () => renderBillList(payments.pastBills || []);

  const renderScene = SceneMap({
    unpaid: UnpaidBills,
    created: CreatedBills,
    received: ReceivedBills,
    past: PastBills,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#34C759"
      inactiveColor="#666"
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcome}>Home</Text>
        
        {loading ? (
          <Text style={styles.loading}>Loading payments...</Text>
        ) : (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            swipeEnabled={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  welcome: {
    fontSize: 34,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  paymentCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    flexDirection: 'row',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentContent: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  createdBy: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  payButton: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabIndicator: {
    backgroundColor: '#34C759',
    height: 3,
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
});

export default HomeScreen;