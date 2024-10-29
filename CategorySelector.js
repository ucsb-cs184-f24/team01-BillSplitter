import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const categories = [
  { id: 'food', label: 'Food & Drinks', icon: 'coffee', color: '#F97316' },
  { id: 'transport', label: 'Transportation', icon: 'truck', color: '#3B82F6' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film', color: '#A855F7' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping-bag', color: '#22C55E' },
  { id: 'utilities', label: 'Utilities', icon: 'home', color: '#EAB308' },
  { id: 'health', label: 'Health', icon: 'heart', color: '#EF4444' },
  { id: 'education', label: 'Education', icon: 'book', color: '#6366F1' },
  { id: 'travel', label: 'Travel', icon: 'map', color: '#14B8A6' },
  { id: 'other', label: 'Other', icon: 'grid', color: '#6B7280' },
];

const CategorySelector = ({ showModal, onClose, selectedCategory, onSelectCategory }) => {
  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryButton, { backgroundColor: category.color }]}
                onPress={() => {
                  onSelectCategory(category);
                  onClose();
                }}
              >
                <Feather name={category.icon} size={28} color="#FFFFFF" />
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  categoryButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CategorySelector;