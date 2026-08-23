import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onPlay: () => void;
}

export default function HomeScreen({ onPlay }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Dónde está?</Text>
      <Text style={styles.subtitle}>Aragón</Text>
      
      <TouchableOpacity style={styles.playButton} onPress={onPlay}>
        <Text style={styles.playButtonText}>JUGAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#D81B60',
    marginBottom: 60,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
