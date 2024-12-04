import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import VenmoLinker from '../components/VenmoLinker';

const VenmoTestScreen = () => {
  const [venmoData, setVenmoData] = useState({
    recipientId: '',
  });

  const handleInputChange = (field, value) => {
    setVenmoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Venmo Payment Test</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient ID</Text>
          <TextInput
            style={styles.input}
            value={venmoData.recipientId}
            onChangeText={(value) => handleInputChange('recipientId', value)}
            placeholder="@username"
            placeholderTextColor="#999"
          />
        </View>

        <VenmoLinker
          recipientId={venmoData.recipientId}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#6C47FF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  venmoButton: {
    backgroundColor: '#6C47FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  }
});

export default VenmoTestScreen;
