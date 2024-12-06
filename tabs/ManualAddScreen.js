import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  ScrollView, 
  Platform, 
  Modal, 
  KeyboardAvoidingView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { styles } from '../styles/ManualAddScreenStyles';
import CategorySelector, { categories } from '../components/CategorySelector';
import BillSplitSection from '../components/BillSplitSection';

const ManualAddScreen = ({ navigation }) => {
  const [billAmount, setBillAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splitMode, setSplitMode] = useState('equal');
  const [splitType, setSplitType] = useState('percentage');
  const [billSplitType, setBillSplitType] = useState('total'); // total or items
  const [totalSplits, setTotalSplits] = useState({});
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ name: '', amount: '' });

  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const calculateFinalBillAmount = () => {
    const baseAmount = billSplitType === 'total'
      ? parseFloat(billAmount) || 0
      : items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    return baseAmount + (parseFloat(taxAmount) || 0) + (parseFloat(tipAmount) || 0);
  };

  const calculateSplitAmount = (friendId) => {
    const finalAmount = calculateFinalBillAmount();
    if (splitMode === 'equal') {
      const totalParticipants = selectedFriends.length + 1;
      return finalAmount / totalParticipants;
    }
    if (!totalSplits[friendId]) return 0;
    const { type, value } = totalSplits[friendId];
    if (type === 'percentage') return (finalAmount * value) / 100;
    return value;
  };

  const calculateCurrentUserSplit = () => {
    const finalAmount = calculateFinalBillAmount();
    if (splitMode === 'equal') {
      const totalParticipants = selectedFriends.length + 1;
      return finalAmount / totalParticipants;
    }
    const totalFriendsSplit = selectedFriends.reduce(
      (sum, friendId) => sum + calculateSplitAmount(friendId),
      0
    );
    return finalAmount - totalFriendsSplit;
  };

  const handleAddBill = async () => {
    const finalAmount = calculateFinalBillAmount();
    if ((!billAmount && billSplitType === 'total') || !title) {
      Alert.alert('Error', 'Please enter bill amount and title');
      return;
    }

    if (selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one friend');
      return;
    }

    setLoading(true);
    try {
      const billRef = await db.collection('bills').add({
        amount: finalAmount,
        baseAmount: billSplitType === 'total'
          ? parseFloat(billAmount)
          : items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
        taxAmount: parseFloat(taxAmount) || 0,
        tipAmount: parseFloat(tipAmount) || 0,
        title,
        description: description || '',
        category,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid,
        status: 'pending',
        participants: [currentUser.uid, ...selectedFriends],
        totalParticipants: selectedFriends.length + 1,
        receiptItems: billSplitType === 'items' ? items : [],
        splits: totalSplits
      });

      const payments = selectedFriends.concat(currentUser.uid).map((userId) => ({
        billId: billRef.id,
        userId,
        amount: userId === currentUser.uid
          ? calculateCurrentUserSplit()
          : calculateSplitAmount(userId),
        status: userId === currentUser.uid ? 'paid' : 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }));

      await Promise.all(payments.map(payment => db.collection('payments').add(payment)));

      Alert.alert('Success', 'Bill added and split successfully!');
      navigation.replace('BillDetails', { billId: billRef.id });
    } catch (error) {
      console.error('Error adding bill:', error);
      Alert.alert('Error', 'Failed to add bill');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!currentItem.name || !currentItem.amount) {
      Alert.alert('Error', 'Please enter item name and amount');
      return;
    }

    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: currentItem.name, amount: parseFloat(currentItem.amount) }
    ]);

    setCurrentItem({ name: '', amount: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} color="#6C47FF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add New Bill</Text>
            </View>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Dinner at Restaurant"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>How would you like to enter the bill?</Text>
            <View style={styles.splitTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.splitTypeButton,
                  billSplitType === 'total' && styles.splitTypeButtonActive
                ]}
                onPress={() => setBillSplitType('total')}
              >
                <Text style={[
                  styles.splitTypeText,
                  billSplitType === 'total' && styles.splitTypeTextActive
                ]}>
                  Total
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.splitTypeButton,
                  billSplitType === 'items' && styles.splitTypeButtonActive
                ]}
                onPress={() => setBillSplitType('items')}
              >
                <Text style={[
                  styles.splitTypeText,
                  billSplitType === 'items' && styles.splitTypeTextActive
                ]}>
                  By Item
                </Text>
              </TouchableOpacity>
            </View>

            {billSplitType === 'total' && (
              <>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  value={billAmount}
                  onChangeText={setBillAmount}
                />
              </>
            )}

            {billSplitType === 'items' && (
              <View>
                <Text style={[styles.label, styles.marginTop]}>Items</Text>
                <View style={styles.itemForm}>
                  <TextInput
                    style={[styles.input, styles.itemInput]}
                    placeholder="Item name"
                    value={currentItem.name}
                    onChangeText={(name) => setCurrentItem((prev) => ({ ...prev, name }))}
                  />
                  <TextInput
                    style={[styles.input, styles.itemAmountInput]}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={currentItem.amount}
                    onChangeText={(amount) => setCurrentItem((prev) => ({ ...prev, amount }))}
                  />
                  <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
                    <Feather name="plus" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>

                {items.map((item) => (
                  <View key={item.id} style={styles.itemContainer}>
                    <Text>{item.name} - ${parseFloat(item.amount).toFixed(2)}</Text>
                  </View>
                ))}

                <Text style={styles.totalAmount}>
                  Total Items Amount: ${items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}
                </Text>
              </View>
            )}

            <Text style={styles.label}>Tax Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Tax Amount"
              keyboardType="numeric"
              value={taxAmount}
              onChangeText={setTaxAmount}
            />

            <Text style={styles.label}>Tip Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Tip Amount"
              keyboardType="numeric"
              value={tipAmount}
              onChangeText={setTipAmount}
            />

            <Text style={styles.totalAmount}>
              Final Total: ${calculateFinalBillAmount().toFixed(2)}
            </Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddBill}>
              <Text style={styles.addButtonText}>Add Bill</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ManualAddScreen;
