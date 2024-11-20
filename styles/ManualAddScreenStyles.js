import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      padding: 20,
      paddingBottom: Platform.OS === 'ios' ? 120 : 80,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#1A1A1A',
    },
    marginBottom: {
      marginBottom: 20,
    },
    marginTop: {
      marginTop: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    amountContainer: {
      flex: 1,
      marginRight: 10,
    },
    categoryContainer: {
      flex: 1,
      marginLeft: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: '#666',
    },
    input: {
      borderColor: '#E0E0E0',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
      marginBottom: 20,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#E0E0E0',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#fff',
    },
    dropdownButtonText: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: '#333',
    },
    dropdownList: {
      backgroundColor: '#fff',
      borderColor: '#E0E0E0',
      borderWidth: 1,
      borderRadius: 8,
      marginTop: 4,
      marginBottom: 16,
      maxHeight: 200,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    dropdownItemText: {
      marginLeft: 8,
      fontSize: 16,
      color: '#333',
    },
    selectedFriendsContainer: {
      marginTop: 16,
      marginBottom: 16,
    },
    splitControls: {
      flexDirection: 'row',
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: '#F5F1FF',
      padding: 4,
    },
    splitModeButton: {
      flex: 1,
      padding: 8,
      alignItems: 'center',
      borderRadius: 6,
    },
    splitModeButtonActive: {
      backgroundColor: '#FFFFFF',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    splitModeButtonText: {
      color: '#666',
      fontWeight: '500',
    },
    splitModeButtonTextActive: {
      color: '#6C47FF',
    },
    splitTypeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      padding: 8,
    },
    splitTypeText: {
      color: '#6C47FF',
      marginRight: 8,
      fontWeight: '500',
    },
    selectedFriendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#F5F1FF',
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedFriendInfo: {
      flex: 1,
    },
    selectedFriendName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
    },
    selectedFriendEmail: {
      fontSize: 14,
      color: '#666',
    },
    selectedFriendActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    splitInput: {
      width: 60,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 4,
      padding: 4,
      marginRight: 8,
      textAlign: 'center',
    },
    splitAmount: {
      fontSize: 16,
      fontWeight: '500',
      color: '#6C47FF',
      marginRight: 8,
      minWidth: 60,
      textAlign: 'right',
    },
    removeButton: {
      padding: 4,
    },
    modalScroll: {
      flex: 1,
    },
    modalDoneButton: {
      backgroundColor: '#6C47FF',
      margin: 16,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalDoneButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ECECEC',
      backgroundColor: '#FFFFFF',
    },
    friendInfo: {
      flex: 1,
    },
    friendName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
    },
    friendEmail: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#6C47FF',
      marginLeft: 12,
    },
    checkedBox: {
      backgroundColor: '#6C47FF',
    },
    loadingText: {
      padding: 20,
      textAlign: 'center',
      color: '#666',
    },
    emptyText: {
      padding: 20,
      textAlign: 'center',
      color: '#666',
    },
    addButton: {
      backgroundColor: '#6C47FF',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    currentUserSplit: {
      backgroundColor: '#F5F1FF',
      marginBottom: 16,
    },
    yourSplitAmount: {
      color: '#6C47FF',
      fontWeight: 'bold',
      fontSize: 18,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      minHeight: '50%',
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1F2937',
    },
    closeButton: {
      padding: 4,
    },
    gridContainer: {
      padding: 16,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryButton: {
      width: '30%',
      aspectRatio: 1,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: '#F5F1FF',
    },
    categoryLabel: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
      color: '#6C47FF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ECECEC',
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
});

export default styles;