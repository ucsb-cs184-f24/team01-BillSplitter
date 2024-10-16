import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import ItemRow from './ItemRow';
import { Item } from './types'

export interface Props {
  items: Item[];
  onAssignItemToPerson: (item: Item) => void;
}

const ItemList: React.FC<Props> = ({ items, onAssignItemToPerson }) => {
  return (
    <View style={styles.itemsContainer}>
      <Text style={styles.header}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ItemRow item={item} assignItemToPerson={onAssignItemToPerson} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ItemList;
