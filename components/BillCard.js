import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { categories } from './CategorySelector';
import VenmoLinker from './VenmoLinker';

const BillCard = ({ 
  item, 
  currentUser, 
  onPress, 
  onPaymentPress,
  creatorId 
}) => {
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  const getCategoryIcon = (category) => {
    const categoryItem = categories.find(cat => cat.id === category);
    return categoryItem ? categoryItem.icon : 'grid';
  };

  const renderStatus = () => {
    if (item.isCreator) {
      if (item.totalPending > 0) {
        if (item.totalPending === 1) {
          return `$${item.pendingAmounts[0].toFixed(2)} pending from ${item.pendingUsers[0]}`;
        }
        return `${item.totalPending} pending`;
      }
      return 'Received';
    }
    if (item.status === 'paid') {
      const date = item.paidAt?.toDate();
      return `Paid${date ? ` on ${date.toLocaleDateString()}` : ''}`;
    }
    return 'You owe';
  };

  const getStatusColor = () => {
    if (item.isCreator) {
      return item.totalPending > 0 ? '#FF9500' : '#34C759';
    }
    return item.status === 'paid' ? '#34C759' : '#FF3B30';  
  };

  const getPendingText = (totalPending, pendingUsers) => {
    if (totalPending === 0) return '';
    if (totalPending === 1) return `Pending from ${pendingUsers[0]}`;
    return `Pending from ${totalPending} people`;
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.paymentCard,
        { backgroundColor: `${getCategoryColor(item.category)}15` },
        { borderColor: getCategoryColor(item.category) }
      ]}>
        <View style={[
          styles.categoryIcon,
          { backgroundColor: `${getCategoryColor(item.category)}30` }
        ]}>
          <Feather
            name={getCategoryIcon(item.category)}
            size={24}
            color={getCategoryColor(item.category)}
          />
        </View>
        
        <View style={styles.paymentContent}>
          <View style={styles.paymentHeader}>
            <Text style={styles.billTitle}>{item.billTitle}</Text>
            <Text style={[
              styles.amount,
              !item.isCreator && item.status === 'pending' && styles.amountOwed
            ]}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
          
          {item.billDescription ? (
            <Text style={styles.description} numberOfLines={2}>
              {item.billDescription}
            </Text>
          ) : null}
          
          <View style={styles.paymentFooter}>
            <Text style={styles.date}>
              Creation Date: {item.createdAt.toLocaleDateString()}
            </Text>
            <Text style={[styles.status, { color: getStatusColor() }]} numberOfLines={2}>
              {renderStatus()}
            </Text>
          </View>
          
          <Text style={styles.createdBy}>
            Creator: {item.creatorName}
          </Text>
          
          {!item.isCreator && item.status === 'pending' && (
            <View style={styles.buttonContainer}>
              {item.creatorVenmoUsername && (
                <View style={styles.venmoWrapper}>
                  <VenmoLinker
                    recipientId={item.creatorVenmoUsername}
                    buttonText="Pay with Venmo"
                  />
                </View>
              )}
              <TouchableOpacity
                style={[styles.payButton, { backgroundColor: getCategoryColor(item.category) }]}
                onPress={(e) => {
                  e.stopPropagation();
                  onPaymentPress(item.id);
                }}
              >
                <Text style={styles.payButtonText}>Mark as Paid</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    paymentCard: {
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
    paymentContent: {
      flex: 1,
    },
    paymentHeader: {
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
    amountOwed: {
      color: '#FF3B30',  
    },
    description: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
    },
    paymentFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    createdBy: {
      fontSize: 14,
      color: '#666',
    },
    status: {
      maxWidth: 125,  
      flexWrap: 'wrap',
      fontWeight: '600',
    },
    date: {
      fontSize: 12,
      color: '#999',
    },
    payButton: {
      flex: 1,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
      height: 35,
      justifyContent: 'center',
    },
    payButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 14,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 8,
      alignItems: 'center',
    },
    venmoWrapper: {
      flex: 1,
      marginTop: 0,
    },
  });

export default BillCard;