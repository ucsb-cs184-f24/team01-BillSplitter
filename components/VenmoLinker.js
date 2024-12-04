import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, SafeAreaView, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';

const VenmoLinker = ({ recipientId, buttonText = 'Pay with Venmo' }) => {
  const [showWebView, setShowWebView] = useState(false);

  const isValid = recipientId;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          !isValid && styles.buttonDisabled,
          { backgroundColor: '#3D95CE' }
        ]}
        onPress={() => setShowWebView(true)}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>
          {buttonText}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebView(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowWebView(false)}
          >
            <Feather name="x" size={24} color="#6C47FF" />
            <Text style={styles.closeButtonText}>Back to Split</Text>
          </TouchableOpacity>
          
          <WebView
            source={{
              uri: `https://venmo.com/${recipientId.replace(/^@/, '')}`,
            }}
            style={styles.webView}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3D95CE',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    height: 35,
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  buttonDisabled: {
    backgroundColor: '#9FCAE8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButtonText: {
    color: '#3D95CE',
    marginLeft: 8,
    fontSize: 16,
  },
  webView: {
    flex: 1,
  }
});

export default VenmoLinker;