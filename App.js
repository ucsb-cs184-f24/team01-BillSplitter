import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, TextInput, Button, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from './firebaseConfig'; 
import SignInScreen from './tabs/SignInScreen'; 
import SignUpScreen from './tabs/SignUpScreen';  
import HomeScreen from './tabs/HomeScreen';  
import AddBillScreen from './tabs/AddBillScreen'; 
import ManualAddScreen from './tabs/ManualAddScreen';
import AddWithPictureScreen from './tabs/AddWithPictureScreen';
import FriendsScreen from './tabs/FriendsScreen';
import SettingsScreen from './tabs/SettingsScreen';
import BillDetailsScreen from './tabs/BillDetailsScreen';
import PastBillsScreen from './tabs/PastBillsScreen';
import SpendingInsightsScreen from './tabs/SpendingInsights';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainAppNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{
      tabBarActiveTintColor: '#6C47FF',}}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),  headerShown: false
        }}
      />
      <Tab.Screen 
        name="Friends" 
        component={FriendsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="people" color={color} size={size} />
          ), headerShown: false
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ), headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: '#F8F9FA' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainAppNavigator} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="AddBill" 
              component={AddBillScreen} 
              options={{ 
                headerShown: false,
                presentation: 'modal'
              }}
            />
            <Stack.Screen 
              name="ManualAddScreen" 
              component={ManualAddScreen} 
              options={{ 
                headerShown: false,
                presentation: 'modal'
              }}
            />
            <Stack.Screen 
              name="AddWithPictureScreen" 
              component={AddWithPictureScreen} 
              options={{ 
                headerShown: false,
                presentation: 'modal'
              }}
            />
            <Stack.Screen 
              name="BillDetails" 
              component={BillDetailsScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="PastBills" 
              component={PastBillsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SpendingInsights" 
              component={SpendingInsightsScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Sign In" 
              component={SignInScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Sign Up" 
              component={SignUpScreen} 
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}