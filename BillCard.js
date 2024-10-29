import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const BillCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[
        styles.billCard,
        { backgroundColor: `${item.category.color}15` },
        { borderColor: item.category.color }
      ]}>
        <View style={[
          styles.categoryIcon,
          { backgroundColor: `${item.category.color}30` }
        ]}>
          <Feather
            name={item.category.icon}
            size={24}
            color={item.category.color}
          />
        </View>
        
        <View style={styles.billContent}>
          <View style={styles.billHeader}>
            <Text style={styles.billTitle}>{item.title}</Text>
            <Text style={styles.amount}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
          
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  billCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    flexDirection: 'row',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billContent: {
    flex: 1,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default BillCard;