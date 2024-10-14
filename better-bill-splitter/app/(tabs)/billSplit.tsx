import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
interface Item {
  id: number;
  name: string;
  price: number;
}

interface Person {
  name: string;
  color: string;
  assignedItems: Item[];
}


const App: React.FC = () => {
  let itemId = 0
  const [items, setItems] = useState<Item[]>([
    {id: 1, name: 'rice', price: 10},
    {id: 2, name: 'eggs', price: 20},
    {id: 3, name: 'soda', price: 30}
  ]);
  const [people, setPeople] = useState<Person[]>([]);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#000000'); 
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newPrice, setNewPrice] = useState(0); 
  

  const addPerson = () => {
    if (newName && newColor) {
      setPeople([...people, { name: newName, color: newColor, assignedItems: [] }]);
      setNewName('');
      setNewColor('#000000');
    }
  };

  const addItems = () => {
    if (newName && newColor) {
      setItems([...items, { id: itemId, name: newItemName,  price: newPrice }]);
      setNewName('');
      setNewPrice(0);
    }
  }

  const assignItemToPerson = (item: Item) => {
    if (selectedPerson) {
      const updatedPeople = people.map(p => {
        if (p.name === selectedPerson) {
          return { ...p, assignedItems: [...p.assignedItems, item] };
        }
        return p;
      });
      setPeople(updatedPeople);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        <Text style={styles.header}>Items</Text>
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>${item.price}</Text>
              <Button title="Assign" onPress={() => assignItemToPerson(item)} />
            </View>
          )}
        />
      </View>
      <View style={styles.addPersonContainer}>
        <Button title="Add Person" onPress={() => setModalVisible(true)} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)} // Handle the close event on Android
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
              <Button title="Add" onPress={ () =>
                  {
                    addPerson(); 
                    setModalVisible(false);
                  }
                } />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
        <Text style={styles.header}>Assigned People</Text>
        <FlatList
          data={people}
          keyExtractor={(person, index) => index.toString()}
          renderItem={({ item }) => {
            const totalAssignedPrice = item.assignedItems.reduce((sum, i) => sum + i.price, 0);
            const totalItemsAssigned = item.assignedItems.length;
            return (
              <View style={styles.itemRow}>
                <Text style={{ color: item.color, fontSize: styles.peopleText.fontSize }}>
                  {item.name}: 
                </Text>
                <Text style={{ color: item.color, fontSize: styles.peopleText.fontSize }}>
                  ${totalAssignedPrice} ({totalItemsAssigned} item{totalItemsAssigned !== 1 ? 's' : ''})
                </Text>
                <Button title="Select" onPress={() => setSelectedPerson(item.name)} />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  itemsContainer: {
    flex: 1,
  },
  addPersonContainer: {
    flex: 1,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  peopleText: {
    fontSize: 20,
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});

export default App;
