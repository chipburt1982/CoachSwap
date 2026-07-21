import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { duesAPI } from '../lib/api';
import { useDuesStore } from '../lib/store';
import { Button } from '../components/UI';

export const DuesStatusScreen = ({ navigation }) => {
  const [duesData, setDuesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const duesStatus = useDuesStore((state) => state.duesStatus);
  const setDuesStatus = useDuesStore((state) => state.setDuesStatus);

  useEffect(() => {
    fetchDuesStatus();
  }, []);

  const fetchDuesStatus = async () => {
    try {
      const response = await duesAPI.getDuesStatus();
      setDuesData(response.data);
      setDuesStatus(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch dues status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Membership Dues</Text>

        {duesData ? (
          <>
            <View style={styles.statusItem}>
              <Text style={styles.label}>Status:</Text>
              <Text style={[styles.value, { color: duesData.isPaid ? '#10b981' : '#ef4444' }]}>
                {duesData.isPaid ? '✓ Up to Date' : '⚠ Payment Due'}
              </Text>
            </View>

            {duesData.nextDueDate && (
              <View style={styles.statusItem}>
                <Text style={styles.label}>Due Date:</Text>
                <Text style={styles.value}>{new Date(duesData.nextDueDate).toLocaleDateString()}</Text>
              </View>
            )}

            {duesData.amountDue > 0 && (
              <View style={styles.amountDueCard}>
                <Text style={styles.amountDueLabel}>Amount Due</Text>
                <Text style={styles.amountDueValue}>${duesData.amountDue.toFixed(2)}</Text>
              </View>
            )}

            <View style={styles.buttonGroup}>
              <Button
                title={duesData.amountDue > 0 ? 'Pay Now' : 'Manage Subscription'}
                onPress={() => navigation.navigate('PaymentOptions', { amount: duesData.amountDue })}
              />
              <Button
                title="View History"
                variant="secondary"
                onPress={() => navigation.navigate('PaymentHistory')}
              />
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};

export const PaymentOptionsScreen = ({ route, navigation }) => {
  const { amount } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await duesAPI.createPaymentIntent(amount);
      navigation.navigate('StripePayment', {
        clientSecret: response.data.clientSecret,
        amount: amount,
        transactionId: response.data.transactionId
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handleRecurring = async () => {
    navigation.navigate('SetupRecurring', { amount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Options</Text>
      <Text style={styles.subtitle}>Choose how to pay your ${amount.toFixed(2)} dues</Text>

      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>💳 Pay Once</Text>
        <Text style={styles.optionDescription}>Pay your current dues now</Text>
        <Button
          title="Pay $" + amount.toFixed(2)
          onPress={handlePayment}
          disabled={loading}
        />
      </View>

      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>🔄 Set Up Recurring Payment</Text>
        <Text style={styles.optionDescription}>Automatic monthly billing</Text>
        <Button
          title="Setup Recurring"
          variant="secondary"
          onPress={handleRecurring}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>💡 Auto-pay ensures you never miss a payment deadline</Text>
      </View>
    </View>
  );
};

export const PaymentHistoryScreen = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await duesAPI.getPaymentHistory();
      setPayments(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const renderPayment = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.paymentType}>{item.type === 'recurring' ? '🔄 Recurring' : '💳 One-time'}</Text>
      </View>
      <View style={styles.paymentAmount}>
        <Text style={[styles.amount, { color: item.status === 'completed' ? '#10b981' : '#f59e0b' }]}>
          ${item.amount.toFixed(2)}
        </Text>
        <Text style={styles.paymentStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : payments.length === 0 ? (
        <Text style={styles.noData}>No payments yet</Text>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPayment}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export const SetupRecurringScreen = ({ route, navigation }) => {
  const { amount } = route.params;
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const handleSetupRecurring = async () => {
    setLoading(true);
    try {
      const response = await duesAPI.setupRecurring({
        amount,
        billingCycle,
        autoRenew: true
      });
      Alert.alert('Success', 'Recurring payment set up!');
      navigation.navigate('DuesStatus');
    } catch (error) {
      Alert.alert('Error', 'Failed to setup recurring payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Auto-Pay</Text>
      <Text style={styles.subtitle}>Your dues will be charged automatically</Text>

      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Billing Cycle</Text>
        {['monthly', 'quarterly', 'yearly'].map((cycle) => (
          <TouchableOpacity
            key={cycle}
            style={[styles.radioOption, billingCycle === cycle && styles.radioOptionSelected]}
            onPress={() => setBillingCycle(cycle)}
          >
            <Text style={styles.radioLabel}>
              {cycle === 'monthly' ? 'Monthly ($' + amount.toFixed(2) + ')' : 
               cycle === 'quarterly' ? 'Quarterly ($' + (amount * 3).toFixed(2) + ')' :
               'Yearly ($' + (amount * 12).toFixed(2) + ')'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Confirm Setup"
        onPress={handleSetupRecurring}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6'
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937'
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500'
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  amountDueCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444'
  },
  amountDueLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500'
  },
  amountDueValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 4
  },
  buttonGroup: {
    marginTop: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937'
  },
  optionDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb'
  },
  infoText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500'
  },
  paymentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paymentInfo: {
    flex: 1
  },
  paymentDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  paymentType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  paymentAmount: {
    alignItems: 'flex-end'
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  paymentStatus: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textTransform: 'capitalize'
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32
  },
  radioOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 8
  },
  radioOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe'
  },
  radioLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500'
  }
});
