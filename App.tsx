import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';

export type ScreenState = 'home' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen === 'home' ? (
        <HomeScreen onPlay={() => setCurrentScreen('game')} />
      ) : (
        <GameScreen onHome={() => setCurrentScreen('home')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
