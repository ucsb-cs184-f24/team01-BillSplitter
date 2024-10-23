import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from '../firebaseConfig';

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {userEmail}!</Text>
    </View>
  );
};

export default HomeScreen;