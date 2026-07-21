import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { messageAPI } from '../lib/api';
import { Button } from '../components/UI';

export const MessagesScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('ConversationDetail', { userId: item.user_id })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <View style={styles.conversationInfo}>
        <Text style={styles.userName}>Coach {item.user_id}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message}
        </Text>
      </View>
      <Text style={styles.time}>{new Date(item.last_message_at).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.user_id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    fontSize: 24
  },
  conversationInfo: {
    flex: 1
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  lastMessage: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  time: {
    fontSize: 12,
    color: '#9ca3af'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280'
  }
});
