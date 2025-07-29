// File: LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken } from './api/client';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (mode) => {
    try {
      const route = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(route, { email, password });
      await AsyncStorage.setItem('token', data.token);
      setToken(data.token);
      onLogin(data.token);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Impossible de contacter le serveur');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swipeflix</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttons}>
        <Button title="Se connecter" onPress={() => handleAuth('login')} />
        <Button title="S'inscrire" onPress={() => handleAuth('register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  title:     { fontSize:32, fontWeight:'bold', textAlign:'center', marginBottom:40 },
  input:     { borderWidth:1, borderRadius:8, padding:12, marginBottom:20 },
  buttons:   { flexDirection:'row', justifyContent:'space-between' }
});
