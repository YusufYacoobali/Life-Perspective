import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Quote } from '../lib/quotes';

interface QuoteCardProps {
  quote: Quote;
  style?: ViewStyle;
  compact?: boolean;
}

export function QuoteCard({ quote, style, compact = false }: QuoteCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        compact ? styles.compact : styles.full,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    >
      <Text style={[styles.mark, { color: colors.accent }]}>"</Text>
      <Text
        style={[
          compact ? styles.textCompact : styles.text,
          { color: colors.text },
        ]}
      >
        {quote.text}
      </Text>
      <Text style={[styles.author, { color: colors.textSecondary }]}>
        — {quote.author}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
  },
  full: {
    padding: 24,
    gap: 8,
  },
  compact: {
    padding: 16,
    gap: 6,
  },
  mark: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  textCompact: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  author: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
