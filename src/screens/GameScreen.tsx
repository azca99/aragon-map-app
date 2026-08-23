import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapComponent from '../components/MapComponent';

interface Props {
  onHome: () => void;
}

export default function GameScreen({ onHome }: Props) {
  const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);

  // Coordenadas aproximadas del centro de Aragón
  const aragonCenter = [-0.9057, 41.5976]; 

  const handleMapPress = (event: any) => {
    const lngLat = event?.nativeEvent?.lngLat || event?.lngLat || event?.geometry?.coordinates;
    if (lngLat && Array.isArray(lngLat)) {
       setPinPosition([lngLat[0], lngLat[1]]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onHome}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>¿Dónde está ZARAGOZA?</Text>
      </View>
      
      <View style={styles.mapContainer}>
        <MapComponent 
          center={aragonCenter} 
          onPress={handleMapPress}
          pinPosition={pinPosition}
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, !pinPosition && styles.confirmButtonDisabled]} 
          disabled={!pinPosition}
        >
          <Text style={styles.confirmButtonText}>CONFIRMAR UBICACIÓN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 30, // para compensar el botón de atrás
  },
  backButton: {
    padding: 5,
    width: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
