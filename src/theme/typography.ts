import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  displayLarge: {
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: 0,
    lineHeight: 72,
  },
  displayMedium: {
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: 0,
    lineHeight: 56,
  },
  displaySmall: {
    fontSize: 36,
    fontWeight: '300',
    letterSpacing: 0,
    lineHeight: 44,
  },
  headingLarge: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headingMedium: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 30,
  },
  headingSmall: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 26,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
};
