import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddPerson: (name: string, color: string) => void;
}

const AddPersonModal: React.FC<Props> = ({ visible, onClose, onAddPerson }) => {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#000000');

  const handleAdd = () => {
    onAddPerson(newName, newColor);
    setNewName('');
    setNewColor('#000000');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Add Person</Text>
          <TextInput
            placeholder="Name"
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <TextInput
            placeholder="Color (Hex)"
            value={newColor}
            onChangeText={setNewColor}
            style={styles.input}
          />
          <Button title="Add" onPress={handleAdd} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default AddPersonModal;
