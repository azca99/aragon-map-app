import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import TopoPattern from '../components/TopoPattern';

interface Props {
  onPlay: () => void;
}

export default function HomeScreen({ onPlay }: Props) {
  return (
    <View style={styles.container}>
      <TopoPattern color={theme.colors.secondary} opacity={0.06} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>¿Dónde está este municipio?</Text>
          <Text style={styles.title}>ARAGÓN</Text>
        </View>

        <View style={styles.heroGraphic}>
          <View style={styles.graphicCircle} />
          <View style={styles.graphicAccent} />
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.8}>
            <Text style={styles.playButtonText}>JUGAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statsButton} activeOpacity={1}>
            <Text style={styles.statsButtonText}>ESTADÍSTICAS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.primary,
    letterSpacing: 2,
    marginTop: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.h2,
    color: theme.colors.textMain,
    textAlign: 'center',
  },
  heroGraphic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.secondary,
    opacity: 0.1,
    position: 'absolute',
  },
  graphicAccent: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
    transform: [{ translateX: 40 }, { translateY: -40 }],
  },
  actions: {
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  playButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    ...theme.shadows.button,
  },
  playButtonText: {
    ...theme.typography.button,
    fontSize: 16,
    letterSpacing: 1,
  },
  statsButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.m,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    opacity: 0.5,
  },
  statsButtonText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
});