import React from 'react';
import { View, Button } from 'react-native';
import firebase from '../firebaseConfig'; // Your Firebase config

const SettingsScreen = ({ navigation }) => {
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(() => {
        // Reset the navigation stack to take the user back to the Sign In screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Sign In' }],
        });
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <View>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default SettingsScreen;