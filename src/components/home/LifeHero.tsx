import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { LifeStats } from '../../types/lifeStats';
import { Unit } from './TimeUnitToggle';

function getUnitDisplay(stats: LifeStats, unit: Unit): { value: number; label: string } {
  switch (unit) {
    case 'years': return { value: stats.yearsRemaining, label: 'years left' };
    case 'months': return { value: stats.monthsRemaining, label: 'months left' };
    case 'weeks': return { value: stats.weeksRemaining, label: 'weeks left' };
    case 'days': return { value: stats.daysRemaining, label: 'days left' };
  }
}

interface LifeHeroProps {
  stats: LifeStats;
  unit: Unit;
}

export function LifeHero({ stats, unit }: LifeHeroProps) {
  const { colors } = useTheme();
  const { value: targetValue, label } = getUnitDisplay(stats, unit);
  const [displayValue, setDisplayValue] = useState(targetValue);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame>>(0 as unknown as ReturnType<typeof requestAnimationFrame>);
  const prevValue = useRef(targetValue);

  useEffect(() => {
    const startValue = 0;
    const endValue = targetValue;
    const duration = 1400;
    const startTime = Date.now();

    cancelAnimationFrame(rafRef.current);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = endValue;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetValue]);

  return (
    <View style={styles.container}>
      <Text style={[styles.number, { color: colors.text }]}>
        {displayValue.toLocaleString()}
      </Text>
      <Text style={[styles.unitLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.secondaryRow}>
        <Text style={[styles.secondaryHighlight, { color: colors.accent }]}>
          {stats.percentageRemaining.toFixed(1)}% still ahead
        </Text>
        <Text style={[styles.secondarySep, { color: colors.textTertiary }]}> · </Text>
        <Text style={[styles.secondaryDim, { color: colors.textTertiary }]}>
          {stats.percentageLived.toFixed(1)}% used
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  number: {
    fontSize: 72,
    fontWeight: '100',
    letterSpacing: -4,
    lineHeight: 80,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryHighlight: {
    fontSize: 13,
    fontWeight: '500',
  },
  secondarySep: {
    fontSize: 13,
  },
  secondaryDim: {
    fontSize: 13,
  },
});
