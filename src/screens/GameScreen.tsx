import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MapComponent from '../components/MapComponent';
import { Municipality } from '../models/Municipality';
import { generateGameMunicipalities } from '../utils/gameLogic';
import { calculateHaversineDistance } from '../utils/geography';
import { calculateScore } from '../utils/scoring';

interface Props {
  onHome: () => void;
}

export interface RoundResult {
  municipality: Municipality;
  distanceKm: number;
  score: number;
  roundNumber: number;
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
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Iniciar partida
  const initGame = () => {
    setGameMunicipalities(generateGameMunicipalities());
    setCurrentRoundIndex(0);
    setTotalScore(0);
    setRoundHistory([]);
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
    setRoundHistory(prev => [...prev, {
      municipality: currentMunicipality,
      distanceKm: dist,
      score: pts,
      roundNumber: currentRoundIndex + 1
    }]);
    
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

  const getAssessmentText = (score: number) => {
    if (score >= 45000) return "Maestro de Aragón";
    if (score >= 35000) return "Conoces Aragón muy bien";
    if (score >= 25000) return "Buen conocimiento";
    if (score >= 15000) return "Todavía queda Aragón por recorrer";
    return "Hora de estudiar el mapa";
  };

  if (isGameOver) {
    const bestRound = [...roundHistory].sort((a, b) => b.score - a.score)[0];
    const worstRound = [...roundHistory].sort((a, b) => a.score - b.score)[0];

    return (
      <View style={styles.gameOverContainer}>
        <ScrollView contentContainerStyle={styles.gameOverScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.gameOverTitle}>PARTIDA TERMINADA</Text>
          <Text style={styles.gameOverScore}>{totalScore.toLocaleString('es-ES')} / 50.000 pts</Text>
          <Text style={styles.gameOverAssessment}>{getAssessmentText(totalScore)}</Text>
          
          {(bestRound && worstRound && roundHistory.length > 0) && (
            <View style={styles.highlightsContainer}>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightLabel}>Mejor ronda</Text>
                <Text style={styles.highlightMuni}>{bestRound.municipality.name}</Text>
                <Text style={styles.highlightPoints}>{bestRound.score.toLocaleString('es-ES')} pts</Text>
              </View>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightLabel}>Peor ronda</Text>
                <Text style={styles.highlightMuni}>{worstRound.municipality.name}</Text>
                <Text style={styles.highlightPoints}>{worstRound.score.toLocaleString('es-ES')} pts</Text>
              </View>
            </View>
          )}

          <Text style={styles.historyTitle}>Resumen de las 10 rondas</Text>
          <View style={styles.historyList}>
            {roundHistory.map((rh, index) => {
               // Indicador visual discreto
               let dotColor = '#EF4444'; // rojo (malo)
               if (rh.score >= 4000) dotColor = '#10B981'; // verde (muy bueno)
               else if (rh.score >= 2000) dotColor = '#F59E0B'; // amarillo (regular)

               // No mostrar borde inferior en el último elemento
               const borderStyle = index === roundHistory.length - 1 ? { borderBottomWidth: 0 } : {};

               return (
                 <View key={index} style={[styles.historyItem, borderStyle]}>
                   <View style={[styles.historyDot, { backgroundColor: dotColor }]} />
                   <View style={styles.historyInfo}>
                     <Text style={styles.historyMuni}>{rh.roundNumber}. {rh.municipality.name}</Text>
                     <Text style={styles.historyDist}>{rh.distanceKm.toFixed(1)} km</Text>
                   </View>
                   <Text style={[styles.historyPts, { color: dotColor }]}>{rh.score.toLocaleString('es-ES')} pts</Text>
                 </View>
               );
            })}
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={initGame}>
            <Text style={styles.primaryButtonText}>JUGAR OTRA VEZ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.primaryButton, styles.secondaryButton]} onPress={onHome}>
            <Text style={[styles.primaryButtonText, styles.secondaryButtonText]}>INICIO</Text>
          </TouchableOpacity>
        </ScrollView>
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
          onPress={handleMapPress}
          pinPosition={pinPosition}
          correctPosition={correctPosition}
          locked={confirmed}
        />
      </View>
      
      {confirmed ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultPoints}>+{roundScore.toLocaleString('es-ES')} puntos</Text>
            <Text style={styles.resultDistance}>A {roundDistance.toFixed(1)} km de distancia</Text>
            
            <View style={styles.resultDivider} />
            
            <Text style={styles.resultName}>{currentMunicipality?.name}</Text>
            <Text style={styles.resultInfo}>{currentMunicipality?.comarca} • {currentMunicipality?.province}</Text>
            <Text style={styles.resultPop}>{currentMunicipality?.population.toLocaleString('es-ES')} habitantes</Text>
            
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
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  resultPoints: {
    fontSize: 32,
    color: '#10B981', // Verde esmeralda (como el pin)
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultDistance: {
    fontSize: 16,
    color: '#4B5563', // Gris oscuro
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  resultName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultInfo: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultPop: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
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
    backgroundColor: '#F3F4F6',
  },
  gameOverScroll: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  gameOverTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  gameOverScore: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 4,
  },
  gameOverAssessment: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 32,
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12, // Nota: gap requiere RN >= 0.71, usamos margin si falla, pero asumo que funciona.
  },
  highlightBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 4,
  },
  highlightLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  highlightMuni: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  highlightPoints: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  historyList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyMuni: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  historyDist: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyPts: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
