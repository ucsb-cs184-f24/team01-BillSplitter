import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const BillSplitSection = ({
  currentUser,
  selectedFriends,
  friends,
  splitMode,
  splitType,
  friendSplits,
  onRemoveFriend,
  onUpdateSplitAmount,
  onToggleSplitMode,
  onToggleSplitType,
  calculateCurrentUserSplit,
  calculateSplitAmount,
  styles, // Pass styles from parent
  scrollViewRef,
  friendPositions,
}) => {
  if (selectedFriends.length === 0) {
    return null;
  }

  return (
    <View style={styles.selectedFriendsContainer}>
      <View style={styles.splitControls}>
        <TouchableOpacity
          style={[styles.splitModeButton, splitMode === 'equal' && styles.splitModeButtonActive]}
          onPress={onToggleSplitMode}
        >
          <Text style={[styles.splitModeButtonText, splitMode === 'equal' && styles.splitModeButtonTextActive]}>
            Split Equally
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.splitModeButton, splitMode === 'custom' && styles.splitModeButtonActive]}
          onPress={onToggleSplitMode}
        >
          <Text style={[styles.splitModeButtonText, splitMode === 'custom' && styles.splitModeButtonTextActive]}>
            Custom Split
          </Text>
        </TouchableOpacity>
      </View>

      {splitMode === 'custom' && (
        <TouchableOpacity
          style={styles.splitTypeToggle}
          onPress={onToggleSplitType}
        >
          <Text style={styles.splitTypeText}>
            Enter in: {splitType === 'percentage' ? 'Percentages' : 'Amounts'}
          </Text>
          <Feather name="refresh-ccw" size={16} color="#007AFF" />
        </TouchableOpacity>
      )}

      {/* Current User Split Display */}
      <View style={[styles.selectedFriendItem, styles.currentUserSplit]}>
        <View style={styles.selectedFriendInfo}>
          <Text style={styles.selectedFriendName}>You</Text>
          <Text style={styles.selectedFriendEmail}>{currentUser.email}</Text>
        </View>
        <View style={styles.selectedFriendActions}>
          <Text style={[styles.splitAmount, styles.yourSplitAmount]}>
            ${calculateCurrentUserSplit()}
          </Text>
        </View>
      </View>

      {/* Friends Split Display */}
      {selectedFriends.map(friendId => {
        const friend = friends.find(f => f.id === friendId);
        if (!friend) return null;
        
        return (
          <View 
            key={friendId} 
            style={styles.selectedFriendItem}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              friendPositions.current[friendId] = y;
            }}
          >
            <View style={styles.selectedFriendInfo}>
              <Text style={styles.selectedFriendName}>{friend.name}</Text>
              <Text style={styles.selectedFriendEmail}>{friend.email}</Text>
            </View>
            <View style={styles.selectedFriendActions}>
              {splitMode === 'custom' && (
                <TextInput
                  style={styles.splitInput}
                  keyboardType="numeric"
                  value={String(friendSplits[friendId]?.value || '')}
                  onChangeText={(text) => onUpdateSplitAmount(friendId, text)}
                  onFocus={() => {
                    const yPosition = friendPositions.current[friendId];
                    if (yPosition) {
                      scrollViewRef.current?.scrollTo({
                        y: yPosition - 100,
                        animated: true,
                      });
                    }
                  }}
                  onEndEditing={() => {
                    const value = friendSplits[friendId]?.value || 0;
                    onUpdateSplitAmount(friendId, value);
                  }}
                  placeholder={splitType === 'percentage' ? '%' : '$'}
                  returnKeyType="done"
                />
              )}
              <Text style={styles.splitAmount}>
                ${calculateSplitAmount(friendId)}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveFriend(friendId)}
              >
                <Feather name="x" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default BillSplitSection;