export const colors = {
  primary: '#B84A32',
  primaryDark: '#8F3426',
  secondary: '#53685A',
  accent: '#D39A3A',
  success: '#477A5A',
  error: '#D2382D',
  background: '#F5F1E8',
  surface: '#FCFAF5',
  textMain: '#252523',
  textSecondary: '#706D66',
  border: '#D7D0C3',
  mapBorder: '#B84A32',
  mapResultLine: '#8F3426',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const radius = {
  s: 6,
  m: 10,
  l: 16,
};

export const shadows = {
  card: {
    shadowColor: '#252523',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    shadowColor: '#8F3426',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  }
};

export const typography = {
  display: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 32,
    color: colors.textMain,
  },
  h1: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 22,
    color: colors.textMain,
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
    fontSize: 14,
    color: colors.textMain,
  },
  caption: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  button: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: colors.surface,
  },
  data: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 24,
    color: colors.textMain,
  },
  dataLarge: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 36,
    color: colors.textMain,
  }
};

export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
};