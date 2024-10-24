import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { IncomingRequestCard } from '../components/IncomingRequestCard';
import { OutgoingRequestCard } from '../components/OutgoingRequestCard';
import { FriendCard } from '../components/FriendCard';

const FriendsScreen = () => {
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const db = firebase.firestore();
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    if (!currentUser) return;
    
    let subscriptions = [];
  
    try {
      // Listen for accepted friendships
      const friendsSubscription = db.collection('friendships')
        .where('status', '==', 'accepted')
        .where('participants', 'array-contains', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot({
          next: snapshot => {
            const friendsPromises = snapshot.docs.map(async doc => {
              try {
                const friendship = doc.data();
                const friendId = friendship.participants.find(id => id !== currentUser.uid);
                const friendDoc = await db.collection('users').doc(friendId).get();
                
                if (!friendDoc.exists) {
                  // Handle case where user document doesn't exist
                  console.warn(`User document ${friendId} not found`);
                  return null;
                }
                
                return {
                  id: doc.id,
                  ...friendDoc.data(),
                  userId: friendId
                };
              } catch (error) {
                console.error("Error processing friend document:", error);
                return null;
              }
            });
            
            Promise.all(friendsPromises)
              .then(friendsData => {
                // Filter out null values from failed promises
                const validFriends = friendsData.filter(friend => friend !== null);
                setFriends(validFriends);
                setLoading(false);
              })
              .catch(error => {
                console.error("Error loading friends:", error);
                setLoading(false);
              });
          },
          error: error => {
            console.error("Friends subscription error:", error);
            setLoading(false);
          }
        });
      
      subscriptions.push(friendsSubscription);
  
      // Listen for incoming friend requests
      const incomingRequestsSubscription = db.collection('friendships')
        .where('status', '==', 'pending')
        .where('receiverId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot({
          next: snapshot => {
            const requestsPromises = snapshot.docs.map(async doc => {
              try {
                const friendship = doc.data();
                const senderDoc = await db.collection('users').doc(friendship.senderId).get();
                
                if (!senderDoc.exists) {
                  // Handle case where sender document doesn't exist
                  console.warn(`Sender document ${friendship.senderId} not found`);
                  return null;
                }
                
                return {
                  id: doc.id,
                  ...senderDoc.data(),
                  userId: friendship.senderId
                };
              } catch (error) {
                console.error("Error processing incoming request:", error);
                return null;
              }
            });
  
            Promise.all(requestsPromises)
              .then(requestsData => {
                const validRequests = requestsData.filter(request => request !== null);
                setIncomingRequests(validRequests);
              })
              .catch(error => {
                console.error("Error loading incoming requests:", error);
              });
          },
          error: error => {
            console.error("Incoming requests subscription error:", error);
          }
        });
      
      subscriptions.push(incomingRequestsSubscription);
  
      // Listen for outgoing friend requests
      const outgoingRequestsSubscription = db.collection('friendships')
        .where('status', '==', 'pending')
        .where('senderId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot({
          next: snapshot => {
            const requestsPromises = snapshot.docs.map(async doc => {
              try {
                const friendship = doc.data();
                const receiverDoc = await db.collection('users').doc(friendship.receiverId).get();
                
                if (!receiverDoc.exists) {
                  // Handle case where receiver document doesn't exist
                  console.warn(`Receiver document ${friendship.receiverId} not found`);
                  return null;
                }
                
                return {
                  id: doc.id,
                  ...receiverDoc.data(),
                  userId: friendship.receiverId
                };
              } catch (error) {
                console.error("Error processing outgoing request:", error);
                return null;
              }
            });
  
            Promise.all(requestsPromises)
              .then(requestsData => {
                const validRequests = requestsData.filter(request => request !== null);
                setOutgoingRequests(validRequests);
              })
              .catch(error => {
                console.error("Error loading outgoing requests:", error);
              });
          },
          error: error => {
            console.error("Outgoing requests subscription error:", error);
          }
        });
      
      subscriptions.push(outgoingRequestsSubscription);
    } catch (error) {
      console.error("Error setting up subscriptions:", error);
      setLoading(false);
    }
  
    // Cleanup function
    return () => {
      subscriptions.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing:", error);
        }
      });
    };
  }, []);

  const sendFriendRequest = () => {
    if (!newFriendEmail) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'Must be logged in to send friend requests');
      return;
    }

    db.collection('users')
      .where('email', '==', newFriendEmail.toLowerCase().trim())
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          Alert.alert('Error', 'User not found');
          return;
        }

        const friendDoc = snapshot.docs[0];
        const friendId = friendDoc.id;

        if (friendId === currentUser.uid) {
          Alert.alert('Error', 'Cannot add yourself as a friend');
          return;
        }

        // Check if already friends or if request exists
        return db.collection('friendships')
          .where('participants', 'array-contains', currentUser.uid)
          .get()
          .then(friendshipSnapshot => {
            const existingFriendship = friendshipSnapshot.docs.find(doc => {
              const data = doc.data();
              return data.participants.includes(friendId);
            });

            if (existingFriendship) {
              const status = existingFriendship.data().status;
              if (status === 'accepted') {
                Alert.alert('Error', 'Already friends with this user');
              } else {
                Alert.alert('Error', 'Friend request already pending');
              }
              return;
            }

            // Create friend request
            return db.collection('friendships').add({
              participants: [currentUser.uid, friendId],
              senderId: currentUser.uid,
              receiverId: friendId,
              status: 'pending',
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          });
      })
      .then(() => {
        setModalVisible(false);
        setNewFriendEmail('');
        Alert.alert('Success', 'Friend request sent!');
      })
      .catch(error => {
        console.error('Error sending friend request:', error);
        Alert.alert('Error', error.message);
      });
  };

  const removeFriend = (friendshipId, friendName) => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friendName} from your friends?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            db.collection('friendships').doc(friendshipId)
              .delete()
              .then(() => {
                Alert.alert('Success', 'Friend removed successfully');
              })
              .catch(error => {
                console.error('Error removing friend:', error);
                Alert.alert('Error', 'Failed to remove friend');
              });
          },
        },
      ]
    );
  };

  const handleFriendRequest = (requestId, accept) => {
    const friendshipRef = db.collection('friendships').doc(requestId);
    
    if (accept) {
      friendshipRef.update({
        status: 'accepted'
      })
      .then(() => {
        Alert.alert('Success', 'Friend request accepted!');
      })
      .catch(error => {
        console.error('Error accepting friend request:', error);
        Alert.alert('Error', error.message);
      });
    } else {
      friendshipRef.delete()
        .then(() => {
          Alert.alert('Success', 'Friend request declined');
        })
        .catch(error => {
          console.error('Error declining friend request:', error);
          Alert.alert('Error', error.message);
        });
    }
  };

  const cancelFriendRequest = (requestId) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this friend request?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            db.collection('friendships').doc(requestId).delete()
              .then(() => {
                Alert.alert('Success', 'Friend request cancelled');
              })
              .catch(error => {
                console.error('Error cancelling friend request:', error);
                Alert.alert('Error', error.message);
              });
          },
        },
      ],
    );
  };

  const renderIncomingRequest = ({ item }) => (
    <IncomingRequestCard
      item={item}
      onAccept={(id) => handleFriendRequest(id, true)}
      onDecline={(id) => handleFriendRequest(id, false)}
    />
  );

  const renderOutgoingRequest = ({ item }) => (
    <OutgoingRequestCard
      item={item}
      onCancel={cancelFriendRequest}
    />
  );

  const renderFriend = ({ item }) => (
    <FriendCard
      item={item}
      onRemove={removeFriend}
    />
  );

  const renderSection = (title, data, renderItem, emptyText) => (
    <View style={styles.section}>
      {data.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionCount}>{data.length}</Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.sectionList}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Friends</Text>
        </View>

        {loading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
) : (
  <View style={styles.content}>
    {incomingRequests.length === 0 && outgoingRequests.length === 0 && friends.length === 0 ? (
      <View style={styles.emptyStateContainer}>
        <Feather name="users" size={48} color="#CCC" />
        <Text style={styles.emptyStateText}>No friends yet</Text>
        <Text style={styles.emptyStateSubtext}>
          Start by adding friends using their email address
        </Text>
      </View>
    ) : (
      <FlatList
        data={[
          { type: 'incoming', data: incomingRequests },
          { type: 'outgoing', data: outgoingRequests },
          { type: 'friends', data: friends }
        ].filter(section => section.data.length > 0)}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'incoming':
              return (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Incoming Requests</Text>
                    <Text style={styles.sectionCount}>{item.data.length}</Text>
                  </View>
                  <FlatList
                    data={item.data}
                    renderItem={renderIncomingRequest}
                    keyExtractor={(request) => request.id}
                    scrollEnabled={false}
                  />
                </View>
              );
            case 'outgoing':
              return (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Outgoing Requests</Text>
                    <Text style={styles.sectionCount}>{item.data.length}</Text>
                  </View>
                  <FlatList
                    data={item.data}
                    renderItem={renderOutgoingRequest}
                    keyExtractor={(request) => request.id}
                    scrollEnabled={false}
                  />
                </View>
              );
            case 'friends':
              return (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>My Friends</Text>
                    <Text style={styles.sectionCount}>{item.data.length}</Text>
                  </View>
                  <FlatList
                    data={item.data}
                    renderItem={renderFriend}
                    keyExtractor={(friend) => friend.id}
                    scrollEnabled={false}
                  />
                </View>
              );
          }
        }}
        keyExtractor={(item) => item.type}
        showsVerticalScrollIndicator={false}
      />
    )}
  </View>
)}

        {/* Add Friend Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="user-plus" size={24} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>Add Friend</Text>
        </TouchableOpacity>

        {/* Modal remains the same */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add New Friend</Text>
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        setModalVisible(false);
                      }}
                      style={styles.modalCloseButton}
                    >
                      <Feather name="x" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.inputLabel}>Friend's Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    value={newFriendEmail}
                    onChangeText={setNewFriendEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      sendFriendRequest();
                    }}
                  >
                    <Text style={styles.submitButtonText}>Send Friend Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Add padding to avoid overlap with floating button
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C757D',
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    color: '#6C757D',
  },
  iconButton: {
    padding: 8,
  },
  acceptButton: {
    backgroundColor: '#40C057',
  },
  declineButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButton: {
    backgroundColor: '#868E96',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    // Add maximum height to ensure modal doesn't take full screen
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
    fontWeight: '600',
    color: '#212529',
  },
  modalCloseButton: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestCardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pendingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
};

export default FriendsScreen;