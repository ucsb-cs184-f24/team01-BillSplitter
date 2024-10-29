import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BillCard from './BillCard';

const HomeScreen = ({ navigation }) => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const loadBills = async () => {
      try {
        const storedBills = await AsyncStorage.getItem('bills');
        if (storedBills) {
          setBills(JSON.parse(storedBills));
        }
      } catch (error) {
        console.error('Error loading bills:', error);
      }
    };

    // Load bills when screen focuses
    const unsubscribe = navigation.addListener('focus', loadBills);
    return unsubscribe;
  }, [navigation]);

const renderBill = ({ item }) => (
    <BillCard 
      item={item} 
      onPress={() => navigation.navigate('BillDetails', { bill: item })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Bills</Text>
        
        <FlatList
          data={bills}
          renderItem={renderBill}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bills added yet</Text>
          }
          contentContainerStyle={styles.listContent}
        />

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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  billCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  billContent: {
    flex: 1,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  billDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 40,
  },
});

export default HomeScreen;