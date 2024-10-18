import React, { useState, useEffect } from 'react';
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
  const [people, setPeople] = useState<Person[]>([
    { name: 'alex', color: '#000000', assignedItems: [], sumOwed: 0 },
    { name: 'suhrit', color: '#00aaf1', assignedItems: [], sumOwed: 0 }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Use effect to log updated people state
  useEffect(() => {
    console.log('People updated:', people);
  }, [people]);

  const addPerson = (name: string, color: string) => {
    setPeople([...people, { name, color, assignedItems: [], sumOwed: 0 }]);
  };

  const assignItemToPerson = (item: Item) => {
    if (selectedPerson) {
      const selectedPersonObj = people.find(p => p.name === selectedPerson);

      // Ensure the person is found
      if (!selectedPersonObj) return;

      // Avoid duplicating assignment
      if (!item.assignedPeople.includes(selectedPersonObj)) {
        // Update the assignedPeople list for the item
        const updatedItem = {
          ...item,
          assignedPeople: [...item.assignedPeople, selectedPersonObj],
        };

        // Recalculate sumOwed for all people assigned to the item
        const pricePerPerson = updatedItem.price / updatedItem.assignedPeople.length;

        // Update the state for each person involved with the item
        selectedPersonObj.sumOwed += pricePerPerson
        selectedPersonObj.assignedItems = [...selectedPersonObj.assignedItems, updatedItem]
        const updatedPeople = people.map(p => {
          if (p.assignedItems.includes(item)) {
            // Update the person's assigned items and sumOwed
            const newAssignedItems = p.assignedItems.some(ai => ai.id === updatedItem.id)
              ? p.assignedItems.map(ai => ai.id === updatedItem.id ? updatedItem : ai)
              : [...p.assignedItems, updatedItem];

            const newSumOwed = p.sumOwed - (item.price / item.assignedPeople.length) + pricePerPerson;

            return {
              ...p,
              assignedItems: newAssignedItems,
              sumOwed: newSumOwed,
            };
          }
          return p;
        });

        // Update the items array
        const updatedItems = items.map(i => (i.id === item.id ? updatedItem : i));

        // Set updated state
        setItems(updatedItems);
        setPeople(updatedPeople);
      }
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
