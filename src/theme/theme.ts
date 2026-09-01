export const colors = {
  primary: '#B84A32',
  primaryDark: '#8F3426',
  secondary: '#53685A',
  accent: '#D39A3A',
  success: '#477A5A',
  warning: '#D39A3A',
  error: '#B84A32', // Terracota/rojo apagado en lugar de rojo puro
  background: '#F5F1E8',
  surface: '#FCFAF5',
  surfaceMuted: '#EFEBE2', // Un poco ms oscuro que el fondo
  textMain: '#252523',
  textSecondary: '#706D66',
  border: '#D7D0C3',
  mapBorder: '#B84A32',
  mapResultLine: '#252523', // Carbn para que destaque sobre el mapa sin ser terracota
};

export const spacing = {
  xs: 4,
  s: 8,
  sm: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  s: 6,
  m: 10,
  l: 16, // Moderado, evita "bubble UI"
};

export const shadows = {
  card: {
    shadowColor: '#252523',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    shadowColor: '#8F3426',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
};

export const typography = {
  display: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 32,
    color: colors.textMain,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 22,
    color: colors.textMain,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 18,
    color: colors.textMain,
  },
  subtitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: colors.textSecondary,
  },
  body: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: colors.textMain,
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  button: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: colors.surface,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  data: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 24,
    color: colors.textMain,
    letterSpacing: -0.5,
  },
  dataLarge: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 36,
    color: colors.textMain,
    letterSpacing: -1,
  }
};

export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
};