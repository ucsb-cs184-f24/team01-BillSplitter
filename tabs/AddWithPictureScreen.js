import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const AddWithPictureScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [items, setItems] = useState([]); // State for storing receipt items
  const [total, setTotal] = useState(null); // State for total amount

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access the camera roll is required!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
        aspect: [2, 3], // Changed aspect ratio to be more receipt-like
        quality: 1,
        allowsMultipleSelection: false,
      });

      console.log('ImagePicker Result:', JSON.stringify(result, null, 2));

      if (!result.canceled) {
        if (result.assets && result.assets[0]) {
          const asset = result.assets[0];
          console.log('Selected asset:', JSON.stringify(asset, null, 2));
          setImageUri(asset.uri);
          if (asset.base64) {
            uploadImageToVeryfi(asset.base64);
          } else {
            Alert.alert('Error', 'Failed to retrieve base64 data');
          }
        }
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImageToVeryfi = async (base64Data) => {
    if (!base64Data) {
      Alert.alert('Error', 'No base64 data available');
      return;
    }

    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

    const url = 'https://api.veryfi.com/api/v8/partner/documents/';
    const headers = {
      'Content-Type': 'application/json',
      'Client-Id': 'vrfgg8zdNriSgmwfeFtvn60sLZXXDTgGyf52Tt1',
      'Authorization': 'apikey nadavavital:5bd7d76e76268b00d6ce8418e2726b51',
      'Accept': 'application/json',
    };

    const data = {
      file_data: cleanBase64,
      categories: ['Grocery', 'Utilities'],
    };

    try {
      const response = await axios.post(url, data, { headers });
      console.log('Veryfi Response:', response.data);
      
      // Extract and set items from the response
      if (response.data.line_items) {
        setItems(response.data.line_items);
      }
      
      // Set total amount
      if (response.data.total) {
        setTotal(response.data.total);
      }
      
      Alert.alert("Success", "Receipt processed successfully!");
    } catch (error) {
      if (error.response) {
        console.error('API Error Response:', error.response.data);
      } else {
        console.error('API Request Error:', error.message);
      }
      Alert.alert('Error', 'There was an error processing the receipt.');
    }
  };

  const renderItems = () => {
    if (items.length === 0) return null;

    return (
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsHeader}>Receipt Items:</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemDescription}>
              {item.description || 'Unknown Item'}
            </Text>
            <Text style={styles.itemPrice}>
              ${item.total ? item.total.toFixed(2) : '0.00'}
            </Text>
          </View>
        ))}
        {total && (
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Bill with Picture</Text>
        <Button title="Select a Picture" onPress={selectImage} />
        {imageUri && (
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image}
            resizeMode="contain"
          />
        )}
        {renderItems()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 400, // Made taller to accommodate receipt shape
    marginVertical: 20,
    borderRadius: 10,
  },
  itemsContainer: {
    width: '100%',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  itemsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemDescription: {
    flex: 1,
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddWithPictureScreen;