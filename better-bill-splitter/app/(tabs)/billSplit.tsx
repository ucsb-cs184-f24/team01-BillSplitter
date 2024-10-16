import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ItemList from '../../components/ItemList';
import PeopleList from '../../components/PeopleList';
import AddPersonModal from '../../components/AddPersonModal';
import { Item, Person } from '../../components/types';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'rice', price: 10, assignedPeople: [] }, 
    { id: 2, name: 'eggs', price: 20, assignedPeople: [] },
    { id: 3, name: 'soda', price: 30, assignedPeople: [] },
  ]);
  const [people, setPeople] = useState<Person[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const addPerson = (name: string, color: string) => {
    setPeople([...people, { name, color, assignedItems: [], sumOwed: 0 }]);
  };

  const assignItemToPerson = (item: Item) => {
    if (selectedPerson) {
      // Update the list of people in the item
      const updatedItem = {
        ...item,
        assignedPeople: [...item.assignedPeople, people.find(p => p.name === selectedPerson)!],
      };

      // Update the list of items in the person
      const updatedPeople = people.map(p => {
        if (p.name === selectedPerson) {
          return { ...p, assignedItems: [...p.assignedItems, updatedItem] };
        }
        return p;
      });

      const updatedItems = items.map(i => (i.id === item.id ? updatedItem : i));

      setItems(updatedItems);
      setPeople(updatedPeople);
    }
  };

  return (
    <View style={styles.container}>
      {/* List of Items */}
      <ItemList 
        items={items} 
        onAssignItemToPerson={assignItemToPerson} 
      />
      
      {/* List of People and their assigned items */}
      <PeopleList 
        people={people} 
        onSelectPerson={setSelectedPerson} 
      />

      {/* Button to open the modal to add a new person */}
      <Button 
        title="Add Person" 
        onPress={() => setModalVisible(true)} 
      />

      {/* Modal for adding a new person */}
      <AddPersonModal 
        visible={modalVisible} 
        onAddPerson={addPerson} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default App;
