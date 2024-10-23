import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AddBillScreen = ({ navigation }) => {

  const handleManualAdd = () => {
    navigation.navigate('ManualAddScreen'); // Navigate to the manual add screen
  };

  const handleAddWithPicture = () => {
    navigation.navigate('AddWithPictureScreen'); // Navigate to the add with picture screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Bill</Text>
      <Button title="Add Bill Manually" onPress={handleManualAdd} />
      <View style={styles.spacing} />
      <Button title="Add Bill with Picture" onPress={handleAddWithPicture} />
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
  spacing: {
    height: 20, // Adds some spacing between the buttons
  },
});

export default AddBillScreen;