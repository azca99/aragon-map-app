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

import aragonBorder from '../data/aragon.json';
import aragonMask from '../data/aragon_mask.json';
import { theme } from '../theme/theme';

interface Props {
  onPress: (lngLat: [number, number]) => void;
  pinPosition: [number, number] | null;
  correctPosition?: [number, number] | null;
  locked?: boolean;
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json'; 

export default function MapComponent({ onPress, pinPosition, correctPosition, locked }: Props) {
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!cameraRef.current) return;

    if (correctPosition && pinPosition) {
      let west = Math.min(pinPosition[0], correctPosition[0]) - FIT_BOUNDS_MARGIN;
      let east = Math.max(pinPosition[0], correctPosition[0]) + FIT_BOUNDS_MARGIN;
      let south = Math.min(pinPosition[1], correctPosition[1]) - FIT_BOUNDS_MARGIN;
      let north = Math.max(pinPosition[1], correctPosition[1]) + FIT_BOUNDS_MARGIN;
      
      west = Math.max(west, MAP_MAX_BOUNDS[0]);
      south = Math.max(south, MAP_MAX_BOUNDS[1]);
      east = Math.min(east, MAP_MAX_BOUNDS[2]);
      north = Math.min(north, MAP_MAX_BOUNDS[3]);

      cameraRef.current.fitBounds(
        [west, south, east, north],
        { padding: { top: 50, right: 50, bottom: 280, left: 50 }, duration: 800 }
      );
    } else if (pinPosition === null && correctPosition == null) {
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
        logo={false}
        attribution={false}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: ARAGON_CENTER,
            zoom: INITIAL_ZOOM,
            pitch: INITIAL_PITCH,
            bearing: INITIAL_BEARING,
          }}
          minZoom={MAP_MIN_ZOOM}
          maxZoom={15.0}
          maxBounds={MAP_MAX_BOUNDS}
        />

        {/* 1. Máscara Exterior (Atenúa todo menos Aragón) */}
        <GeoJSONSource id="aragon-mask" data={aragonMask as any}>
          <Layer
            id="aragon-mask-layer"
            type="fill"
            style={{
              fillColor: theme.colors.surface,
              fillOpacity: 0.15,
            }}
          />
        </GeoJSONSource>

        {/* 2. Límite Administrativo de Aragón */}
        <GeoJSONSource id="aragon-border" data={aragonBorder as any}>
          <Layer
            id="aragon-border-layer"
            type="line"
            style={{
              lineColor: theme.colors.mapBorder,
              lineWidth: 2,
              lineOpacity: 1,
            }}
          />
        </GeoJSONSource>
        
        {/* 3. Línea de Resultado */}
        {lineFeature && (
          <GeoJSONSource id="result-line" data={lineFeature}>
            <Layer 
              id="result-line-layer" 
              type="line"
              style={{
                lineColor: theme.colors.mapResultLine,
                lineWidth: 2.5,
                lineDasharray: [2, 2]
              }} 
            />
          </GeoJSONSource>
        )}

        {/* 4. Marcadores */}
        {correctPosition && (
          <Marker
            id="correct-pin"
            lngLat={correctPosition as [number, number]}
            anchor="bottom"
          >
             <View style={styles.correctPinContainer}>
               <View style={styles.correctPinHead}>
                  <View style={styles.correctPinInnerDot} />
               </View>
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
               <View style={styles.pinHead}>
                 <View style={styles.pinInnerDot} />
               </View>
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
    height: 44,
    width: 24,
    zIndex: 10,
  },
  pinHead: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: theme.colors.textMain,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pinInnerDot: {
    width: 6,
    height: 6,
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  pinPoint: {
    width: 3,
    height: 18,
    backgroundColor: theme.colors.primaryDark,
    marginTop: -2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  correctPinContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 44,
    width: 24,
    zIndex: 9,
  },
  correctPinHead: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: theme.colors.textMain,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  correctPinInnerDot: {
    width: 6,
    height: 6,
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  correctPinPoint: {
    width: 3,
    height: 18,
    backgroundColor: '#305A40',
    marginTop: -2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  }
});