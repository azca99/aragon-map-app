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
          <Text style={styles.subtitle}>¿DÓNDE ESTÁ?</Text>
          <Text style={styles.title}>ARAGÓN</Text>
          <Text style={styles.description}>
            Pon a prueba cuánto conoces el territorio aragonés.
          </Text>
        </View>

        <View style={styles.heroGraphic}>
          <View style={styles.graphicCircle} />
          <View style={styles.graphicAccent} />
        </View>
        
        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>10 PUEBLOS · 50.000 PUNTOS</Text>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.85}>
            <Text style={styles.playButtonText}>JUGAR</Text>
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl * 1.5,
    paddingBottom: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.primary,
    letterSpacing: 4,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.m,
  },
  description: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.m,
  },
  heroGraphic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.secondary,
    opacity: 0.08,
    position: 'absolute',
  },
  graphicAccent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    opacity: 0.9,
    transform: [{ translateX: 60 }, { translateY: -60 }],
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  infoContainer: {
    marginBottom: theme.spacing.l,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    fontWeight: '700',
  },
  playButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    width: '100%',
    ...theme.shadows.button,
  },
  playButtonText: {
    ...theme.typography.button,
    fontSize: 16,
    letterSpacing: 2,
  },
});