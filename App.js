// File: App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import SwipeScreen from './SwipeScreen';
import MatchScreen from './MatchScreen';
import { setToken } from './api/client';

const Stack = createStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token) {
        setToken(token);
        setUserToken(token);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!userToken ? (
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLogin={setUserToken} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Swipe" component={SwipeScreen} />
              <Stack.Screen name="Match" component={MatchScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
