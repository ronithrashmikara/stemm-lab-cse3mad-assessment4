import { StyleSheet } from 'react-native';

export const colors = {
  background: '#eef3f6',
  surface: '#ffffff',
  surfaceAlt: '#f7fafb',
  primary: '#17324d',
  primaryAlt: '#245a78',
  accent: '#1d8664',
  warning: '#b65c17',
  danger: '#a93a35',
  muted: '#5a6872',
  text: '#17212b',
  border: '#d7e0e7',
  softBlue: '#e8f4ff',
  softGreen: '#e8f7ef',
  softAmber: '#fff4df',
};

export const globalStyles = StyleSheet.create({
  screenTitle: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0,
  },
  body: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
