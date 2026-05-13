import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { LifeStats } from '../../types/lifeStats';

interface PremiumStatCardProps {
  stats: LifeStats;
}

interface StatItemProps {
  value: number;
  label: string;
  isLast?: boolean;
}

function StatItem({ value, label, isLast }: StatItemProps) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.item, !isLast && { borderRightColor: colors.border, borderRightWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.value, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
        {value.toLocaleString()}
      </Text>
      <Text style={[styles.label, { color: colors.textTertiary }]}>{label}</Text>
    </View>
  );
}

export function PremiumStatCard({ stats }: PremiumStatCardProps) {
  const { colors, isDark } = useTheme();
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <StatItem value={stats.yearsRemaining} label="years" />
      <StatItem value={stats.monthsRemaining} label="months" />
      <StatItem value={stats.weeksRemaining} label="weeks" />
      <StatItem value={stats.daysRemaining} label="days" isLast />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '200',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
