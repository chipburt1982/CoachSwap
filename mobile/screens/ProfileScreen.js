import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { userAPI } from '../lib/api';
import { useAuthStore } from '../lib/store';
import { Button } from '../components/UI';

export const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(user.userId);
      setProfile(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : profile ? (
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={styles.name}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {profile.average_rating || 'No ratings'}</Text>
              <Text style={styles.verified}>
                {profile.verified ? '✓ Verified' : 'Not verified'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Payment Methods</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>My Listings</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Support</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Help Center</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Contact Support</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Logout"
            variant="danger"
            onPress={handleLogout}
          />
        </View>
      ) : null}
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
  content: {
    padding: 16
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  avatarText: {
    fontSize: 40
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    gap: 8
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  verified: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: 'bold'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  menuText: {
    fontSize: 14,
    color: '#1f2937'
  },
  arrow: {
    fontSize: 18,
    color: '#d1d5db'
  }
});
