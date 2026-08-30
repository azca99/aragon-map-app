import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import MapComponent from '../components/MapComponent';
import { theme } from '../theme/theme';
import TopoPattern from '../components/TopoPattern';
import { generateGameMunicipalities } from '../utils/gameLogic';
import { calculateScore } from '../utils/scoring';
import { calculateHaversineDistance } from '../utils/geography';
import { Municipality } from '../models/Municipality';

interface RoundResult {
  municipality: Municipality;
  distance: number;
  points: number;
}

interface Props {
  onHome: () => void;
}

export default function GameScreen({ onHome }: Props) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [roundDistance, setRoundDistance] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Animations
  const resultCardAnim = useRef(new Animated.Value(0)).current;

  // Lock para evitar doble confirmación
  const confirmLock = useRef(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    setMunicipalities(generateGameMunicipalities());
    setCurrentRoundIndex(0);
    setPinPosition(null);
    setConfirmed(false);
    setRoundDistance(0);
    setRoundScore(0);
    setTotalScore(0);
    setRoundHistory([]);
    setIsGameOver(false);
    confirmLock.current = false;
    resultCardAnim.setValue(0);
  };

  const handleMapPress = (lngLat: [number, number]) => {
    if (!confirmed) {
      setPinPosition(lngLat);
    }
  };

  const handleConfirm = () => {
    if (!pinPosition || confirmed || isGameOver || confirmLock.current) return;
    
    // Bloquear síncronamente
    confirmLock.current = true;
    
    const currentMuni = municipalities[currentRoundIndex];
    if (currentMuni) {
      const distance = calculateHaversineDistance(
        pinPosition[1],
        pinPosition[0],
        currentMuni.latitude,
        currentMuni.longitude
      );
      const points = calculateScore(distance);
      
      setRoundDistance(distance);
      setRoundScore(points);
      setTotalScore((prev) => prev + points);
      
      setRoundHistory((prev) => [
        ...prev,
        { municipality: currentMuni, distance, points }
      ]);
      
      setConfirmed(true);
      
      Animated.timing(resultCardAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNext = () => {
    if (currentRoundIndex < 9) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setPinPosition(null);
      setConfirmed(false);
      confirmLock.current = false;
      resultCardAnim.setValue(0);
    } else {
      setIsGameOver(true);
    }
  };

  const currentMunicipality = municipalities[currentRoundIndex];

  const getAssessmentText = (score: number) => {
    if (score >= 45000) return "¡Maestro de Aragón!";
    if (score >= 35000) return "Gran Conocedor";
    if (score >= 25000) return "Explorador Aficionado";
    if (score >= 15000) return "Turista Despistado";
    return "Necesitas un mapa";
  };

  const getPointColor = (pts: number) => {
    if (pts >= 4000) return theme.colors.success;
    if (pts >= 2000) return theme.colors.accent;
    return theme.colors.error;
  };

  if (isGameOver) {
    let bestRound = roundHistory[0];
    let worstRound = roundHistory[0];
    
    roundHistory.forEach(r => {
      if (r.points > bestRound.points) bestRound = r;
      if (r.points < worstRound.points) worstRound = r;
    });

    return (
      <View style={styles.gameOverContainer}>
        <View style={styles.gameOverHeader}>
          <TopoPattern color={theme.colors.secondary} opacity={0.06} />
          <Text style={styles.gameOverTitle}>PARTIDA TERMINADA</Text>
          <Text style={styles.gameOverScore}>{totalScore.toLocaleString('es-ES')}</Text>
          <Text style={styles.gameOverScoreMax}>/ 50.000 pts</Text>
          <Text style={styles.gameOverAssessment}>{getAssessmentText(totalScore)}</Text>
        </View>

        <ScrollView style={styles.gameOverScroll} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.highlightsContainer}>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightLabel}>Mejor Ronda</Text>
              <Text style={styles.highlightMuni}>{bestRound?.municipality.name}</Text>
              <Text style={[styles.highlightPoints, { color: theme.colors.success }]}>
                {bestRound?.points.toLocaleString('es-ES')} pts
              </Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightLabel}>Peor Ronda</Text>
              <Text style={styles.highlightMuni}>{worstRound?.municipality.name}</Text>
              <Text style={[styles.highlightPoints, { color: theme.colors.error }]}>
                {worstRound?.points.toLocaleString('es-ES')} pts
              </Text>
            </View>
          </View>
          
          <View style={styles.historyList}>
            {roundHistory.map((r, i) => (
              <View key={i} style={[styles.historyItem, i === 9 && { borderBottomWidth: 0 }]}>
                <View style={styles.historyLeft}>
                  <View style={[styles.historyDot, { backgroundColor: getPointColor(r.points) }]} />
                  <Text style={styles.historyNumber}>{i + 1}.</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyMuni}>{r.municipality.name}</Text>
                  <Text style={styles.historyDist}>{r.distance.toFixed(1)} km</Text>
                </View>
                <Text style={[styles.historyPts, { color: getPointColor(r.points) }]}>
                  {r.points.toLocaleString('es-ES')}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.endActions}>
            <TouchableOpacity style={styles.primaryButton} onPress={initGame} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>JUGAR OTRA VEZ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={onHome} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>INICIO</Text>
            </TouchableOpacity>
          </View>
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
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onHome}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.roundText}>Ronda {currentRoundIndex + 1} / 10</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{totalScore.toLocaleString('es-ES')} pts</Text>
          </View>
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>¿Dónde está</Text>
          <Text style={styles.questionMuni}>
            {currentMunicipality ? currentMunicipality.name : '...'}?
          </Text>
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
        <Animated.View style={[
          styles.resultCard, 
          { 
            transform: [{ 
              translateY: resultCardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0]
              }) 
            }] 
          }
        ]}>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultPoints, { color: getPointColor(roundScore) }]}>
              +{roundScore.toLocaleString('es-ES')} pts
            </Text>
            <Text style={styles.resultDistance}>{roundDistance.toFixed(1)} km</Text>
          </View>
          
          <View style={styles.resultDivider} />
          
          <Text style={styles.resultName}>{currentMunicipality?.name}</Text>
          <Text style={styles.resultInfo}>{currentMunicipality?.comarca} · {currentMunicipality?.province}</Text>
          <Text style={styles.resultPop}>{currentMunicipality?.population.toLocaleString('es-ES')} hab.</Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>{currentRoundIndex < 9 ? 'SIGUIENTE' : 'FINALIZAR'}</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !pinPosition && styles.primaryButtonDisabled]} 
            disabled={!pinPosition}
            onPress={handleConfirm}
            activeOpacity={0.8}
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
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 10,
    ...theme.shadows.card,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
  },
  roundText: {
    ...theme.typography.subtitle,
  },
  scoreContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  scoreText: {
    ...theme.typography.subtitle,
    color: theme.colors.primary,
  },
  questionContainer: {
    alignItems: 'center',
  },
  questionLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  questionMuni: {
    ...theme.typography.h1,
    color: theme.colors.textMain,
    marginTop: theme.spacing.xs,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  footer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  resultCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderTopLeftRadius: theme.radius.l,
    borderTopRightRadius: theme.radius.l,
    ...theme.shadows.card,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  resultPoints: {
    ...theme.typography.dataLarge,
    marginBottom: theme.spacing.xs,
  },
  resultDistance: {
    ...theme.typography.subtitle,
  },
  resultDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  resultName: {
    ...theme.typography.h1,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  resultInfo: {
    ...theme.typography.body,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  resultPop: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    ...theme.shadows.button,
  },
  primaryButtonDisabled: {
    backgroundColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    ...theme.typography.button,
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.m,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.m,
  },
  secondaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  gameOverContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gameOverHeader: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  gameOverTitle: {
    ...theme.typography.subtitle,
    letterSpacing: 2,
    marginBottom: theme.spacing.m,
  },
  gameOverScore: {
    ...theme.typography.display,
    fontSize: 48,
    color: theme.colors.primary,
  },
  gameOverScoreMax: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.m,
  },
  gameOverAssessment: {
    ...theme.typography.h2,
    color: theme.colors.textMain,
  },
  gameOverScroll: {
    padding: theme.spacing.m,
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.l,
    gap: theme.spacing.m,
  },
  highlightBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  highlightLabel: {
    ...theme.typography.caption,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: theme.spacing.s,
  },
  highlightMuni: {
    ...theme.typography.body,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  highlightPoints: {
    ...theme.typography.body,
    fontWeight: '700',
  },
  historyList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.s,
  },
  historyNumber: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  historyInfo: {
    flex: 1,
  },
  historyMuni: {
    ...theme.typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  historyDist: {
    ...theme.typography.caption,
  },
  historyPts: {
    ...theme.typography.body,
    fontWeight: '700',
    textAlign: 'right',
  },
  endActions: {
    marginBottom: theme.spacing.xl,
  }
});