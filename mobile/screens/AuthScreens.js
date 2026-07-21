import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { authAPI } from '../lib/api';
import { useAuthStore } from '../lib/store';
import { Button } from '../components/UI';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, userId } = response.data;
      setUser({ userId }, token);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoachSwap</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLink}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        email,
        password,
        firstName,
        lastName
      });
      const { token, userId } = response.data;
      setUser({ userId }, token);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={loading ? 'Creating account...' : 'Sign Up'} onPress={handleSignup} disabled={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f3f4f6'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6b7280'
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 14
  },
  signupLink: {
    textAlign: 'center',
    color: '#2563eb',
    marginTop: 16,
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});
