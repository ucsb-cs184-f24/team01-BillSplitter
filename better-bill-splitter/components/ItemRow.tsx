import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Item } from './types';

interface Props {
  item: Item;
  assignItemToPerson: (item: Item) => void;
}

const ItemRow: React.FC<Props> = ({ item, assignItemToPerson }) => {
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>${item.price}</Text>
      <Button title="Assign" onPress={() => assignItemToPerson(item)} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    flex: 1,
  },
});

export default ItemRow;
