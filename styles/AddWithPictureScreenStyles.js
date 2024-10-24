import { StyleSheet } from "react-native";
import { Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageButton: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 8,
    gap: 8,
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#333',
  },
  itemsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  itemCard: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  assignLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  assignees: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assigneeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ECECEC',
  },
  assigneeChipSelected: {
    backgroundColor: '#007AFF',
  },
  assigneeChipText: {
    color: '#666',
  },
  assigneeChipTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
  },
  processingText: {
    marginLeft: 8,
    color: '#666',
  },
  // Add to your existing styles
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
  maxHeight: '80%',
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  marginBottom: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: '600',
},
modalCloseButton: {
  padding: 4,
},
modalScroll: {
  maxHeight: '70%',
},
friendItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#ECECEC',
},
friendInfo: {
  flex: 1,
},
friendName: {
  fontSize: 16,
  fontWeight: '500',
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
  borderColor: '#007AFF',
  marginLeft: 12,
},
checkedBox: {
  backgroundColor: '#007AFF',
},
modalDoneButton: {
  backgroundColor: '#007AFF',
  padding: 16,
  alignItems: 'center',
  margin: 16,
  borderRadius: 8,
},
modalDoneButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
friendButton: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderWidth: 1,
  borderColor: '#ECECEC',
  borderRadius: 8,
  gap: 8,
},
friendButtonText: {
  fontSize: 16,
  color: '#333',
  flex: 1,
},
contentContainer: {
  paddingBottom: 40, // Add safe area padding
},
horizontalContainer: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 12,
},
flex1: {
  flex: 1,
},
horizontalSpacing: {
  width: 12,
},
// Update these styles to match the horizontal layout
input: {
  borderWidth: 1,
  borderColor: '#ECECEC',
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  backgroundColor: '#fff',
},
categoryButton: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderWidth: 1,
  borderColor: '#ECECEC',
  borderRadius: 8,
  gap: 8,
  backgroundColor: '#fff',
  height: 48, // Match the height of the TextInput
},
});

  export default styles;