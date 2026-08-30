import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import { theme } from './src/theme/theme';
import {
  useFonts,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold
} from '@expo-google-fonts/manrope';

export type ScreenState = 'home' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
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
    backgroundColor: theme.colors.background,
  },
});