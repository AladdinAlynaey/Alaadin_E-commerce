export const colors = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#4834D4',
  accent: '#FD79A8',
  accentLight: '#FDCB6E',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#D63031',

  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F2F6',
    text: '#2D3436',
    textSecondary: '#636E72',
    textTertiary: '#B2BEC3',
    border: '#DFE6E9',
  },
  dark: {
    background: '#0D1117',
    surface: '#161B22',
    surfaceSecondary: '#21262D',
    text: '#F0F6FC',
    textSecondary: '#8B949E',
    textTertiary: '#484F58',
    border: '#30363D',
  },
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
};

export const fonts = {
  regular: { fontSize: 14, fontWeight: '400' as const },
  medium: { fontSize: 14, fontWeight: '500' as const },
  semibold: { fontSize: 14, fontWeight: '600' as const },
  bold: { fontSize: 14, fontWeight: '700' as const },
  heading: { fontSize: 24, fontWeight: '800' as const },
};
