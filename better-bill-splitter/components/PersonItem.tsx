import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Person } from './types';

interface Props {
  person: Person;
  onSelect: (name: string) => void;
}

const PersonItem: React.FC<Props> = ({ person, onSelect }) => {
  const totalAssignedPrice = person.assignedItems.reduce((sum, i) => sum + i.price, 0);
  const totalItemsAssigned = person.assignedItems.length;

  return (
    <View style={styles.itemRow}>
      <Text style={{ color: person.color, fontSize: styles.peopleText.fontSize }}>
        {person.name}: 
      </Text>
      <Text style={{ color: person.color, fontSize: styles.peopleText.fontSize }}>
        ${totalAssignedPrice} ({totalItemsAssigned} item{totalItemsAssigned !== 1 ? 's' : ''})
      </Text>
      <Button title="Select" onPress={() => onSelect(person.name)} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  peopleText: {
    fontSize: 20,
  },
});

export default PersonItem;
