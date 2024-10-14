import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PersonItem from './PersonItem';
import { Person } from './types';

interface Props {
  people: Person[];
  setSelectedPerson: (name: string) => void;
}

const PeopleList: React.FC<Props> = ({ people, setSelectedPerson }) => {
  return (
    <View style={styles.addPersonContainer}>
      <Text style={styles.header}>Assigned People</Text>
      <FlatList
        data={people}
        keyExtractor={(person, index) => index.toString()}
        renderItem={({ item }) => (
          <PersonItem person={item} onSelect={setSelectedPerson} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addPersonContainer: {
    flex: 1,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PeopleList;
