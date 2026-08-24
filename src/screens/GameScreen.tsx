import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapComponent from '../components/MapComponent';
import { Municipality } from '../models/Municipality';
import { generateGameMunicipalities } from '../utils/gameLogic';
import { calculateHaversineDistance } from '../utils/geography';
import { calculateScore } from '../utils/scoring';

interface Props {
  onHome: () => void;
}

export default function GameScreen({ onHome }: Props) {
  // Game State
  const [gameMunicipalities, setGameMunicipalities] = useState<Municipality[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [roundDistance, setRoundDistance] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Coordenadas aproximadas del centro de Aragón
  const aragonCenter = [-0.9057, 41.5976];

  // Iniciar partida
  const initGame = () => {
    setGameMunicipalities(generateGameMunicipalities());
    setCurrentRoundIndex(0);
    setTotalScore(0);
    resetRound();
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const resetRound = () => {
    setPinPosition(null);
    setConfirmed(false);
    setRoundScore(0);
    setRoundDistance(0);
  };

  const handleMapPress = (lngLat: [number, number]) => {
    if (!confirmed) {
      setPinPosition(lngLat);
    }
  };

  const currentMunicipality = gameMunicipalities[currentRoundIndex];

  const handleConfirm = () => {
    if (!pinPosition || !currentMunicipality) return;

    // Calcular distancia (Haversine espera lat, lon)
    // pinPosition es [lon, lat] y currentMunicipality tiene latitud, longitud
    const dist = calculateHaversineDistance(
      pinPosition[1],
      pinPosition[0],
      currentMunicipality.latitude,
      currentMunicipality.longitude
    );
    
    const pts = calculateScore(dist);

    setRoundDistance(dist);
    setRoundScore(pts);
    setTotalScore(prev => prev + pts);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (currentRoundIndex < 9) {
      setCurrentRoundIndex(prev => prev + 1);
      resetRound();
    } else {
      setIsGameOver(true);
    }
  };

  if (isGameOver) {
    return (
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>PARTIDA TERMINADA</Text>
        <Text style={styles.gameOverScore}>{totalScore.toLocaleString('es-ES')} / 50.000 puntos</Text>
        
        <TouchableOpacity style={styles.primaryButton} onPress={initGame}>
          <Text style={styles.primaryButtonText}>JUGAR OTRA VEZ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.primaryButton, styles.secondaryButton]} onPress={onHome}>
          <Text style={[styles.primaryButtonText, styles.secondaryButtonText]}>INICIO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const correctPosition: [number, number] | null = (confirmed && currentMunicipality) 
    ? [currentMunicipality.longitude, currentMunicipality.latitude] 
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onHome}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.roundText}>Ronda {currentRoundIndex + 1} / 10</Text>
          <Text style={styles.headerText}>
            ¿Dónde está {currentMunicipality ? currentMunicipality.name.toUpperCase() : '...'}?
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{totalScore.toLocaleString('es-ES')} pts</Text>
        </View>
      </View>
      
      <View style={styles.mapContainer}>
        <MapComponent 
          center={aragonCenter} 
          onPress={handleMapPress}
          pinPosition={pinPosition}
          correctPosition={correctPosition}
          locked={confirmed}
        />
      </View>
      
      {confirmed ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultName}>{currentMunicipality?.name.toUpperCase()}</Text>
          <Text style={styles.resultInfo}>{currentMunicipality?.comarca} · {currentMunicipality?.province}</Text>
          <Text style={styles.resultPop}>Población: {currentMunicipality?.population.toLocaleString('es-ES')} habitantes</Text>
          
          <View style={styles.resultStats}>
            <Text style={styles.resultDistance}>Te has quedado a {roundDistance.toFixed(1)} km</Text>
            <Text style={styles.resultPoints}>+{roundScore.toLocaleString('es-ES')} puntos</Text>
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>{currentRoundIndex < 9 ? 'SIGUIENTE' : 'FINALIZAR'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !pinPosition && styles.primaryButtonDisabled]} 
            disabled={!pinPosition}
            onPress={handleConfirm}
          >
            <Text style={styles.primaryButtonText}>CONFIRMAR UBICACIÓN</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitles: {
    flex: 1,
    alignItems: 'center',
  },
  roundText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
  scoreText: {
    color: '#4CAF50',
    fontSize: 12,
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
  resultCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  resultInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  resultPop: {
    fontSize: 13,
    color: '#999',
    marginBottom: 15,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultDistance: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  resultPoints: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#333',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  gameOverScore: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 40,
  }
});
