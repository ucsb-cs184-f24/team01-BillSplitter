import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import ItemRow, { Item } from './ItemRow';


interface Props {
  items: Item[];
  assignItemToPerson: (item: Item) => void;
}

const ItemList: React.FC<Props> = ({ items, assignItemToPerson }) => {
  return (
    <View style={styles.itemsContainer}>
      <Text style={styles.header}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ItemRow item={item} assignItemToPerson={assignItemToPerson} />}
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
