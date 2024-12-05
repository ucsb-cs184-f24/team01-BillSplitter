import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { IncomingRequestCard } from '../components/IncomingRequestCard';
import { OutgoingRequestCard } from '../components/OutgoingRequestCard';
import { FriendCard } from '../components/FriendCard';
import { UserSearchResultsModal } from '../components/UserSearchResultsModal';
import { GroupModal } from '../components/GroupModal'; 
import { GroupDetailsModal } from '../components/GroupDetailsModal'; // New component we'll create

const FriendsScreen = () => {
  const [friends, setFriends] = useState([]);
  const [friendGroups, setFriendGroups] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const db = firebase.firestore();
  const currentUser = firebase.auth().currentUser;
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searching, setSearching] = useState(false);
  
  // New state for group details modal
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupDetailsModalVisible, setGroupDetailsModalVisible] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    let subscriptions = [];
  
    try {
      // ... (previous friends subscription code remains the same)

      // Add new subscription for friend groups
      const friendGroupsSubscription = db.collection('friend_groups')
        .where('members', 'array-contains', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot({
          next: snapshot => {
            const groups = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setFriendGroups(groups);
          },
          error: error => {
            console.error("Friend groups subscription error:", error);
          }
        });
      
      subscriptions.push(friendGroupsSubscription);
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

  // ... (keep existing methods like sendFriendRequest, removeFriend, etc.)

  const openGroupDetails = (group) => {
    setSelectedGroup(group);
    setGroupDetailsModalVisible(true);
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity 
      style={styles.groupCard} 
      onPress={() => openGroupDetails(item)}
    >
      <View style={styles.avatarContainer}>
        <Feather name="users" size={24} color="#FFFFFF" />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendEmail}>
          {item.members.length} member{item.members.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
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
          <FlatList
            data={[
              { type: 'incoming', data: incomingRequests },
              { type: 'outgoing', data: outgoingRequests },
              { type: 'groups', data: friendGroups },
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
                case 'groups':
                  return (
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Friend Groups</Text>
                        <Text style={styles.sectionCount}>{item.data.length}</Text>
                      </View>
                      <FlatList
                        data={item.data}
                        renderItem={renderGroup}
                        keyExtractor={(group) => group.id}
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

        {/* Floating Buttons - Now stacked */}
        <TouchableOpacity
          style={[styles.floatingButton, { 
            bottom: 20,
            backgroundColor: '#6C47FF' 
          }]}
          onPress={() => {
            setSearching(true);
          }}
        >
          <Feather name="user-plus" size={24} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>Add Friend</Text>
        </TouchableOpacity>

        {friends.length > 0 && (
          <TouchableOpacity
            style={[styles.floatingButton, { 
              bottom: 80, 
              backgroundColor: '#40C057' 
            }]}
            onPress={() => setCreateGroupModalVisible(true)}
          >
            <Feather name="users" size={24} color="#FFFFFF" />
            <Text style={styles.floatingButtonText}>Create Friend Group</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Existing Modals */}
      <GroupModal
        visible={createGroupModalVisible}
        onClose={() => setCreateGroupModalVisible(false)}
        friends={friends}
        currentUser={currentUser}
        groupName={groupName}
        setGroupName={setGroupName}
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}
        onCreateGroup={createFriendGroup}
      />
      
      <UserSearchResultsModal
        visible={searching}
        onClose={() => setSearching(false)}
        currentUser={currentUser}
        db={db}
        setModalVisible={setSearching}
        setNewFriendEmail={setNewFriendEmail}
      />

      {/* New Group Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={groupDetailsModalVisible}
        onRequestClose={() => setGroupDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedGroup?.name || 'Group Details'}
              </Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setGroupDetailsModalVisible(false)}
              >
                <Feather name="x" size={24} color="#212529" />
              </TouchableOpacity>
            </View>
            
            {selectedGroup && (
              <ScrollView>
                <Text style={styles.groupDetailsText}>
                  Created by: {selectedGroup.creatorId === currentUser.uid ? 'You' : 'Another member'}
                </Text>
                <Text style={styles.groupDetailsText}>
                  Members: {selectedGroup.members.length}
                </Text>
                {/* You might want to add more details or a list of members here */}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Add new styles for group card and details
const styles = {
  // ... (previous styles remain the same)
  
  groupCard: {
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
  groupDetailsText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 12,
  },
};

export default FriendsScreen;