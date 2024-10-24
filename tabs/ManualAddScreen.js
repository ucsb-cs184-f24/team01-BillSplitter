import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, Platform, Modal, KeyboardAvoidingView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { styles } from '../styles/ManualAddScreenStyles';
import CategorySelector, {categories} from '../components/CategorySelector';
import FriendSelector from '../components/FriendSelector';
import BillSplitSection from '../components/BillSplitSection';

const ManualAddScreen = ({ navigation }) => {
  const [billAmount, setBillAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [showCategoryModal, setShowCategoryModal] = useState(false);  // Add this line
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splitMode, setSplitMode] = useState('equal');
  const [splitType, setSplitType] = useState('percentage');
  const [friendSplits, setFriendSplits] = useState({});
  
  const scrollViewRef = useRef(null);
  const friendPositions = useRef({});
  
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = db.collection('friendships')
      .where('status', '==', 'accepted')
      .where('participants', 'array-contains', currentUser.uid)
      .onSnapshot(async snapshot => {
        try {
          const friendsPromises = snapshot.docs.map(async doc => {
            const friendship = doc.data();
            const friendId = friendship.participants.find(id => id !== currentUser.uid);
            const friendDoc = await db.collection('users').doc(friendId).get();
            
            return {
              id: friendId,
              name: friendDoc.data()?.displayName || friendDoc.data()?.email,
              email: friendDoc.data()?.email,
            };
          });

          const friendsData = await Promise.all(friendsPromises);
          setFriends(friendsData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching friends:', error);
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []);

  const updateSplitAmount = (friendId, value, type = splitType) => {
    const newSplits = { ...friendSplits };
    
    if (type === 'percentage') {
      // Clamp between 0 and 100 for percentage
      newSplits[friendId] = {
        type: 'percentage',
        value: Math.min(Math.max(parseFloat(value) || 0, 0), 100)
      };
    } else {
      // Clamp between 0 and total bill amount for dollar amount
      newSplits[friendId] = {
        type: 'amount',
        value: Math.min(Math.max(parseFloat(value) || 0, 0), parseFloat(billAmount) || 0)
      };
    }
    
    setFriendSplits(newSplits);
  };

  const calculateCurrentUserSplit = () => {
    if (!billAmount) return '0.00';
    const totalAmount = parseFloat(billAmount);
    
    if (splitMode === 'equal') {
      const totalParticipants = selectedFriends.length + 1;
      return (totalAmount / totalParticipants).toFixed(2);
    }
    
    // For custom split, calculate remaining amount after friends' splits
    let totalFriendsSplit = 0;
    selectedFriends.forEach(friendId => {
      if (friendSplits[friendId]) {
        if (friendSplits[friendId].type === 'percentage') {
          totalFriendsSplit += (totalAmount * friendSplits[friendId].value) / 100;
        } else {
          totalFriendsSplit += friendSplits[friendId].value;
        }
      }
    });
    
    return (totalAmount - totalFriendsSplit).toFixed(2);
  };

  const calculateSplitAmount = (friendId) => {
    if (!billAmount) return '0.00';
    const totalAmount = parseFloat(billAmount);
    
    if (splitMode === 'equal') {
      const totalParticipants = selectedFriends.length + 1;
      return (totalAmount / totalParticipants).toFixed(2);
    }
    
    if (!friendSplits[friendId]) {
      return '0.00';
    }

    if (friendSplits[friendId].type === 'percentage') {
      return ((totalAmount * friendSplits[friendId].value) / 100).toFixed(2);
    }
    
    return friendSplits[friendId].value.toFixed(2);
  };

  const toggleSplitMode = () => {
    const newMode = splitMode === 'equal' ? 'custom' : 'equal';
    setSplitMode(newMode);
    
    // Reset splits when changing to equal mode
    if (newMode === 'equal') {
      const equalSplit = 100 / (selectedFriends.length + 1);
      const newSplits = {};
      selectedFriends.forEach(friendId => {
        newSplits[friendId] = {
          type: 'percentage',
          value: equalSplit
        };
      });
      setFriendSplits(newSplits);
    }
  };

  const toggleSplitType = () => {
    const newType = splitType === 'percentage' ? 'amount' : 'percentage';
    setSplitType(newType);
    
    // Convert existing splits to new type
    const newSplits = {};
    selectedFriends.forEach(friendId => {
      const currentSplit = friendSplits[friendId] || { type: 'percentage', value: 0 };
      if (newType === 'amount') {
        newSplits[friendId] = {
          type: 'amount',
          value: parseFloat(calculateSplitAmount(friendId))
        };
      } else {
        const totalAmount = parseFloat(billAmount) || 0;
        newSplits[friendId] = {
          type: 'percentage',
          value: totalAmount ? (currentSplit.value / totalAmount) * 100 : 0
        };
      }
    });
    setFriendSplits(newSplits);
  };

  const removeFriend = (friendId) => {
    setSelectedFriends(prev => prev.filter(id => id !== friendId));
    const newSplits = { ...friendSplits };
    delete newSplits[friendId];
    setFriendSplits(newSplits);
  };

  const handleAddBill = async () => {
    if (!billAmount || !title) {
      Alert.alert('Error', 'Please enter bill amount and title');
      return;
    }

    if (selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one friend');
      return;
    }

    const amount = parseFloat(billAmount);
    
    try {
      const billRef = await db.collection('bills').add({
        amount: amount,
        title: title,
        description: description || '',
        category: category,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid,
        status: 'pending',
        participants: [currentUser.uid, ...selectedFriends],
        totalParticipants: selectedFriends.length + 1,
        splits: friendSplits,
      });

      const paymentPromises = [
        db.collection('payments').add({
          billId: billRef.id,
          userId: currentUser.uid,
          amount: parseFloat(calculateSplitAmount(currentUser.uid)),
          status: 'paid',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }),
        ...selectedFriends.map(friendId =>
          db.collection('payments').add({
            billId: billRef.id,
            userId: friendId,
            amount: parseFloat(calculateSplitAmount(friendId)),
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
        )
      ];

      await Promise.all(paymentPromises);
      Alert.alert('Success', 'Bill added and split successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding bill:', error);
      Alert.alert('Error', 'Failed to add bill. Please try again.');
    }
  };

  const selectedCategory = categories.find(cat => cat.id === category);

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.container}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Bill</Text>
        </View>
  
        <View style={styles.content}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, styles.marginBottom]}
            placeholder="e.g., Dinner at Restaurant"
            value={title}
            onChangeText={setTitle}
          />
  
          <View style={styles.rowContainer}>
            <View style={styles.amountContainer}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={billAmount}
                onChangeText={setBillAmount}
              />
            </View>
  
            <View style={styles.categoryContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Feather name={selectedCategory.icon} size={20} color="#007AFF" />
                <Text style={styles.dropdownButtonText}>{selectedCategory.label}</Text>
                <Feather name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
  
          <Text style={[styles.label, styles.marginTop]}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any relevant details"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
  
          <Text style={[styles.label, styles.marginTop]}>Split With</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowFriendSelector(true)}
          >
            <Feather name="users" size={20} color="#007AFF" />
            <Text style={styles.dropdownButtonText}>
              {selectedFriends.length > 0 
                ? `${selectedFriends.length} friends selected` 
                : 'Select friends'}
            </Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
  
          {selectedFriends.length > 0 && (
            <BillSplitSection
              currentUser={currentUser}
              selectedFriends={selectedFriends}
              friends={friends}
              splitMode={splitMode}
              splitType={splitType}
              friendSplits={friendSplits}
              onRemoveFriend={removeFriend}
              onUpdateSplitAmount={updateSplitAmount}
              onToggleSplitMode={toggleSplitMode}
              onToggleSplitType={toggleSplitType}
              calculateCurrentUserSplit={calculateCurrentUserSplit}
              calculateSplitAmount={calculateSplitAmount}
              styles={styles}
              scrollViewRef={scrollViewRef}
              friendPositions={friendPositions}
            />
          )}
  
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddBill}
          >
            <Text style={styles.addButtonText}>Add Bill</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  
      {/* Category Selection Modal */}
      <CategorySelector
        showModal={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={category}
        onSelectCategory={setCategory}
      />
  
      {/* Friend Selection Modal */}
      <FriendSelector
        visible={showFriendSelector}
        onClose={() => setShowFriendSelector(false)}
        friends={friends}
        selectedFriends={selectedFriends}
        onSelectFriend={(friendId) => {
          setSelectedFriends(prev =>
            prev.includes(friendId)
              ? prev.filter(id => id !== friendId)
              : [...prev, friendId]
          );
        }}
        loading={loading}
      />
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ManualAddScreen;
