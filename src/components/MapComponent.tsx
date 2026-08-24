import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Map, Camera, Marker } from '@maplibre/maplibre-react-native';

interface Props {
  center: number[];
  onPress: (lngLat: [number, number]) => void;
  pinPosition: [number, number] | null;
}

// Estilo de mapa mudo basado en CARTO Voyager (sin etiquetas)
// Totalmente gratuito para uso no comercial y de desarrollo.
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json'; 

export default function MapComponent({ center, onPress, pinPosition }: Props) {
  
  const handleMapPress = (event: any) => {
    const lngLat = event?.nativeEvent?.lngLat || event?.lngLat || event?.geometry?.coordinates;
    if (lngLat && Array.isArray(lngLat) && lngLat.length >= 2) {
      onPress([lngLat[0], lngLat[1]]);
    }
  };

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE}
        onPress={handleMapPress}
        logoEnabled={true}
        attributionEnabled={true}
      >
        <Camera
          center={center as [number, number]}
          zoom={7.0}
          minZoom={6.5}
          maxZoom={15.0}
          maxBounds={[-3.5, 39.0, 1.5, 43.5]} // [west, south, east, north] dando margen a Aragón
          duration={0}
        />
        
        {pinPosition && (
          <Marker
            id="user-pin"
            lngLat={pinPosition as [number, number]}
            anchor="bottom"
          >
             <View style={styles.pinContainer}>
               <View style={styles.pinHead} />
               <View style={styles.pinPoint} />
             </View>
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
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 40,
    width: 20,
    // Transformación para que el ancla "bottom" sea exactamente la punta de la chincheta
    transform: [{ translateY: 0 }],
  },
  pinHead: {
    width: 20,
    height: 20,
    backgroundColor: '#D81B60',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 2,
  },
  pinPoint: {
    width: 4,
    height: 15,
    backgroundColor: '#333',
    marginTop: -4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    zIndex: 1,
  }
});
