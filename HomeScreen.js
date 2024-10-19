import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from './firebaseConfig';

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
      <Button title="Go to Second Page" onPress={() => navigation.navigate('Second Page')} />
    </View>
  );
};

export default HomeScreen;
