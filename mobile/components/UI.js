import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const Header = ({ title, onBack, rightAction }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {rightAction ? <View style={styles.right}>{rightAction}</View> : <View style={styles.placeholder} />}
    </View>
  );
};

export const Button = ({ title, onPress, variant = 'primary', disabled = false }) => {
  const bgColor = variant === 'primary' ? '#2563eb' : variant === 'danger' ? '#ef4444' : '#6b7280';
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor, opacity: disabled ? 0.5 : 1 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const Input = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputPlaceholder}>{placeholder}</Text>
      <View style={styles.input}>
        <Text style={styles.inputText}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  backButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  right: {
    width: 40
  },
  placeholder: {
    width: 40
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  inputContainer: {
    marginVertical: 8
  },
  inputPlaceholder: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  inputText: {
    fontSize: 14,
    color: '#1f2937'
  }
});
