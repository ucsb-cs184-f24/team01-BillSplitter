import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CategorySelector from './CategorySelector';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBillScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSave = async () => {
    if (!title || !amount || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const newBill = {
        id: Date.now().toString(),
        title,
        amount: parseFloat(amount),
        category: selectedCategory,
        createdAt: new Date().toISOString(),
      };

      // Get existing bills
      const existingBillsJson = await AsyncStorage.getItem('bills');
      const existingBills = existingBillsJson ? JSON.parse(existingBillsJson) : [];

      // Add new bill
      const updatedBills = [...existingBills, newBill];
      await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));

      Alert.alert('Success', 'Bill saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save bill');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Bill</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter bill title"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          {selectedCategory ? (
            <View style={styles.selectedCategory}>
              <Feather name={selectedCategory.icon} size={20} color={selectedCategory.color} />
              <Text style={styles.selectedCategoryText}>{selectedCategory.label}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Select a category</Text>
          )}
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Bill</Text>
      </TouchableOpacity>

      <CategorySelector
        showModal={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCategoryText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBillScreen;