import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [imageSize, setImageSize] = useState(null);

  const showImageOptions = () => {
    Alert.alert(
      'Select Media',
      'Choose an option to add media',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Upload File',
          onPress: pickDocument,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const processImageResult = (result) => {
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      
      // Calculate the display dimensions while maintaining aspect ratio
      const imageWidth = asset.width;
      const imageHeight = asset.height;
      const maxWidth = screenWidth - 40; // Account for padding
      const displayWidth = maxWidth;
      const displayHeight = (imageHeight / imageWidth) * displayWidth;

      setImageSize({ width: displayWidth, height: displayHeight });
      setSelectedMedia({
        uri: asset.uri,
        type: 'image',
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Changed to false to prevent forced cropping
        quality: 1,
      });

      processImageResult(result);
    } catch (error) {
      Alert.alert('Error taking photo');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need gallery permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Changed to false to prevent forced cropping
        quality: 1,
      });

      processImageResult(result);
    } catch (error) {
      Alert.alert('Error picking image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.assets) {
        setSelectedMedia({
          uri: result.assets[0].uri,
          type: 'document',
          name: result.assets[0].name
        });
        setImageSize(null);
      }
    } catch (error) {
      Alert.alert('Error picking document');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={showImageOptions}
      >
        <Text style={styles.buttonText}>Add Media</Text>
      </TouchableOpacity>

      {selectedMedia && (
        <View style={styles.mediaContainer}>
          {selectedMedia.type === 'image' ? (
            <Image
              source={{ uri: selectedMedia.uri }}
              style={[
                styles.image,
                imageSize && {
                  width: imageSize.width,
                  height: imageSize.height,
                }
              ]}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.documentContainer}>
              <Text style={styles.documentText}>
                Selected file: {selectedMedia.name}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    borderRadius: 10,
  },
  documentContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  documentText: {
    fontSize: 16,
  },
});
