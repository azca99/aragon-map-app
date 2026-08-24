import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Map, Camera, Marker, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';

interface Props {
  center: number[];
  onPress: (lngLat: [number, number]) => void;
  pinPosition: [number, number] | null;
  correctPosition?: [number, number] | null;
  locked?: boolean;
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json'; 

export default function MapComponent({ center, onPress, pinPosition, correctPosition, locked }: Props) {
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (correctPosition && pinPosition && cameraRef.current) {
      // Calcular bounds que incluyan ambos puntos
      const west = Math.min(pinPosition[0], correctPosition[0]);
      const east = Math.max(pinPosition[0], correctPosition[0]);
      const south = Math.min(pinPosition[1], correctPosition[1]);
      const north = Math.max(pinPosition[1], correctPosition[1]);
      
      // Animar la cámara para encuadrar ambos puntos
      cameraRef.current.fitBounds(
        [west, south, east, north],
        { padding: { top: 100, right: 50, bottom: 250, left: 50 }, duration: 1000 }
      );
    }
  }, [correctPosition, pinPosition]);

  const handleMapPress = (event: any) => {
    if (locked) return;
    const lngLat = event?.nativeEvent?.lngLat || event?.lngLat || event?.geometry?.coordinates;
    if (lngLat && Array.isArray(lngLat) && lngLat.length >= 2) {
      onPress([lngLat[0], lngLat[1]]);
    }
  };

  // Línea GeoJSON para conectar los puntos
  const lineFeature = (pinPosition && correctPosition) ? {
    type: 'FeatureCollection' as const,
    features: [{
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: [pinPosition, correctPosition]
      }
    }]
  } : null;

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE}
        onPress={handleMapPress}
      >
        <Camera
          ref={cameraRef}
          center={center as [number, number]}
          zoom={7.0}
          minZoom={6.5}
          maxZoom={15.0}
          maxBounds={[-3.5, 39.0, 1.5, 43.5]}
          duration={0}
        />
        
        {lineFeature && (
          <GeoJSONSource id="result-line" data={lineFeature}>
            <Layer 
              id="result-line-layer" 
              type="line"
              style={{
                lineColor: '#333',
                lineWidth: 3,
                lineDasharray: [2, 2]
              }} 
            />
          </GeoJSONSource>
        )}

        {correctPosition && (
          <Marker
            id="correct-pin"
            lngLat={correctPosition as [number, number]}
            anchor="bottom"
          >
             <View style={styles.correctPinContainer}>
               <View style={styles.correctPinHead} />
               <View style={styles.correctPinPoint} />
             </View>
          </Marker>
        )}
        
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
  },
  correctPinContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 40,
    width: 20,
    zIndex: 10,
  },
  correctPinHead: {
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
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
  correctPinPoint: {
    width: 4,
    height: 15,
    backgroundColor: '#333',
    marginTop: -4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    zIndex: 1,
  }
});
