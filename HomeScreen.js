import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Swipeflix !</Text>
      <Button title="Commencer à swiper" onPress={() => navigation.replace('Swipe')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title:     { fontSize:24, fontWeight:'bold', textAlign:'center', marginBottom:20 }
});
