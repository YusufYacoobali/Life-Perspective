import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { formatNumber } from '../lib/timeCalculations';

interface StatCardProps {
  value: number;
  label: string;
  sublabel?: string;
  style?: ViewStyle;
  large?: boolean;
}

export function StatCard({ value, label, sublabel, style, large = false }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    >
      <Text
        style={[
          large ? styles.valueLarge : styles.value,
          { color: colors.text },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatNumber(value)}
      </Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {sublabel && (
        <Text style={[styles.sublabel, { color: colors.textTertiary }]}>{sublabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  valueLarge: {
    fontSize: 32,
    fontWeight: '200',
    letterSpacing: 0,
    lineHeight: 40,
  },
  value: {
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: 0,
    lineHeight: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  sublabel: {
    fontSize: 10,
    marginTop: 2,
  },
});
