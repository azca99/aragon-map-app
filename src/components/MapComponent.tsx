import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Map, Camera, Marker, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';

import {
  ARAGON_CENTER,
  INITIAL_ZOOM,
  INITIAL_PITCH,
  INITIAL_BEARING,
  MAP_MAX_BOUNDS,
  MAP_MIN_ZOOM,
  FIT_BOUNDS_MARGIN
} from '../constants/map';

// GeoJSON generado del contorno administrativo de Aragón
import aragonBorder from '../data/aragon.json';

interface Props {
  onPress: (lngLat: [number, number]) => void;
  pinPosition: [number, number] | null;
  correctPosition?: [number, number] | null;
  locked?: boolean;
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json'; 

export default function MapComponent({ onPress, pinPosition, correctPosition, locked }: Props) {
  const cameraRef = useRef<any>(null);

  // Efecto para encuadrar resultados o resetear la cámara
  useEffect(() => {
    if (!cameraRef.current) return;

    if (correctPosition && pinPosition) {
      // ESTADO DE RESULTADO: Hacer fitBounds a los dos puntos
      const west = Math.min(pinPosition[0], correctPosition[0]) - FIT_BOUNDS_MARGIN;
      const east = Math.max(pinPosition[0], correctPosition[0]) + FIT_BOUNDS_MARGIN;
      const south = Math.min(pinPosition[1], correctPosition[1]) - FIT_BOUNDS_MARGIN;
      const north = Math.max(pinPosition[1], correctPosition[1]) + FIT_BOUNDS_MARGIN;
      
      cameraRef.current.fitBounds(
        [west, south, east, north],
        // Más padding abajo (bottom: 280) para que la tarjeta de resultados no tape los puntos
        { padding: { top: 50, right: 50, bottom: 280, left: 50 }, duration: 800 }
      );
    } else if (pinPosition === null && correctPosition == null) {
      // ESTADO INICIAL DE RONDA: resetear cámara explícitamente
      cameraRef.current.flyTo({
        center: ARAGON_CENTER,
        zoom: INITIAL_ZOOM,
        pitch: INITIAL_PITCH,
        bearing: INITIAL_BEARING,
        duration: 400
      });
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
        logo={true}
        attribution={true}
        logoPosition={{ bottom: 10, left: 10 }}
        attributionPosition={{ bottom: 10, right: 10 }}
      >
        <Camera
          ref={cameraRef}
          center={ARAGON_CENTER}
          zoom={INITIAL_ZOOM}
          pitch={INITIAL_PITCH}
          bearing={INITIAL_BEARING}
          minZoom={MAP_MIN_ZOOM}
          maxZoom={15.0}
          maxBounds={MAP_MAX_BOUNDS}
          duration={0} // 0 para la carga inicial
        />

        {/* 1. Límite Administrativo de Aragón (Fondo) */}
        <GeoJSONSource id="aragon-border" data={aragonBorder as any}>
          <Layer
            id="aragon-border-layer"
            type="line"
            style={{
              lineColor: '#6B7280', // Gris visible pero no intrusivo
              lineWidth: 2,
              lineOpacity: 0.8,
              lineDasharray: [2, 1]
            }}
          />
        </GeoJSONSource>
        
        {/* 2. Línea de Resultado */}
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

        {/* 3. Marcadores de Posición Correcta y del Usuario */}
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
