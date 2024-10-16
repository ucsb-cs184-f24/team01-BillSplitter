import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Handle successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: styles.title }, 'Login'),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'Email',
      value: email,
      onChangeText: setEmail,
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    }),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'Password',
      value: password,
      onChangeText: setPassword,
      secureTextEntry: true,
    }),
    error
      ? React.createElement(Text, { style: styles.error }, error)
      : null,
    React.createElement(Button, {
      title: 'Login',
      onPress: handleLogin,
    })
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default LoginPage;
