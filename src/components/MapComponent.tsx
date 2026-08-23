import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Map, Camera, Marker } from '@maplibre/maplibre-react-native';

interface Props {
  center: number[];
  onPress: (feature: any) => void;
  pinPosition: [number, number] | null;
}

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json'; 

export default function MapComponent({ center, onPress, pinPosition }: Props) {
  
  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE}
        onPress={onPress}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Camera
          center={center as [number, number]}
          zoom={6.5}
          duration={0}
        />
        
        {pinPosition && (
          <Marker
            id="user-pin"
            lngLat={pinPosition}
          >
             <View style={styles.pin} />
          </Marker>
        )}
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  pin: {
    width: 20,
    height: 20,
    backgroundColor: '#D81B60',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white'
  }
});
