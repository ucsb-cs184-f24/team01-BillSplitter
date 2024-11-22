import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, RefreshControl, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { categories } from '../components/CategorySelector';
import BillCard from '../components/BillCard';

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      setPayments(paymentsData);
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

  const renderPayment = ({ item }) => (
    <BillCard
      item={item}
      currentUser={currentUser}
      onPress={() => navigation.navigate('BillDetails', { billId: item.billId })}
      onPaymentPress={handlePayment}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../assets/SplitLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>Start splitting!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcome}>Home</Text>

        {loading ? (
          <Text style={styles.loading}>Loading payments...</Text>
        ) : (
          <FlatList
            data={payments}
            renderItem={renderPayment}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#34C759"
                colors={['#34C759']}
              />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
        )}

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBill')}
        >
          <Text style={styles.addButtonText}>Add New Bill</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  welcome: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#6C47FF",
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C47FF',
  },
});

export default HomeScreen;
