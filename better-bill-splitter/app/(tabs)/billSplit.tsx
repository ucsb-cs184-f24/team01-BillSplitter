import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ItemList from '../../components/ItemList';
import PeopleList from '../../components/PeopleList';
import AddPersonModal from '../../components/AddPersonModal';
import { Item, Person } from '../../components/types';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'rice', price: 10 },
    { id: 2, name: 'eggs', price: 20 },
    { id: 3, name: 'soda', price: 30 },
  ]);
  const [people, setPeople] = useState<Person[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const addPerson = (name: string, color: string) => {
    setPeople([...people, { name, color, assignedItems: [] }]);
  };

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
