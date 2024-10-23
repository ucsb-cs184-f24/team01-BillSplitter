import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ManualAddScreen = ({ navigation }) => {
  const [billAmount, setBillAmount] = useState('');

  const handleAddBill = () => {
    console.log(`Manual Bill Added: $${billAmount}`);
    // Add further logic to handle the manual bill addition
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Bill Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Bill Amount"
        keyboardType="numeric"
        value={billAmount}
        onChangeText={setBillAmount}
      />
      <Button title="Add Bill" onPress={handleAddBill} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});

export default ManualAddScreen;