import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { listingAPI } from '../lib/api';
import { Button } from '../components/UI';

export const ListingsScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await listingAPI.getListings({ page: 1, limit: 20 });
      setListings(response.data.listings);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const renderListing = ({ item }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => navigation.navigate('ListingDetail', { id: item.id })}
    >
      <View style={styles.listingImage}>
        <Text style={styles.imagePlaceholder}>📦</Text>
      </View>
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.listingCategory}>{item.category}</Text>
        <View style={styles.listingFooter}>
          <Text style={styles.listingPrice}>${item.price}</Text>
          <Text style={styles.listingCondition}>{item.condition}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Equipment</Text>
        <Button
          title="+ Sell"
          onPress={() => navigation.navigate('CreateListing')}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading listings...</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={fetchListings}
          refreshing={loading}
        />
      )}
    </View>
  );
};

export const CreateListingScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Helmets');
  const [condition, setCondition] = useState('Good');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !description || !price || !location) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await listingAPI.createListing({
        title,
        description,
        category,
        condition,
        price: parseFloat(price),
        location,
        forTrade: false
      });
      Alert.alert('Success', 'Listing created!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Create Listing</Text>
      {/* Form inputs would go here */}
      <Button
        title={loading ? 'Creating...' : 'Create Listing'}
        onPress={handleCreate}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2
  },
  listingImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePlaceholder: {
    fontSize: 40
  },
  listingInfo: {
    flex: 1,
    padding: 12
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  listingCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb'
  },
  listingCondition: {
    fontSize: 12,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6'
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937'
  }
});
