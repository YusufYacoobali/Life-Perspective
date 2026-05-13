import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import { LifeStats } from '../../types/lifeStats';
import { Unit } from './TimeUnitToggle';

type DotState = 'used' | 'current' | 'remaining';

interface DotsConfig {
  dots: DotState[];
  cols: number;
  caption: string;
}

function computeDots(unit: Unit, stats: LifeStats, today: Date): DotsConfig {
  if (unit === 'years') {
    const total = stats.estimatedLifeExpectancyYears;
    const lived = stats.yearsLived;
    const dots: DotState[] = Array.from({ length: total }, (_, i) =>
      i < lived ? 'used' : i === lived ? 'current' : 'remaining'
    );
    return {
      dots,
      cols: 10,
      caption: `1 dot = 1 year  ·  estimated ${total}-year lifespan`,
    };
  }

  if (unit === 'months') {
    const totalMonths = stats.estimatedLifeExpectancyYears * 12;
    const monthsLived = stats.monthsLived;
    const windowSize = 144;
    const windowStart = Math.max(0, monthsLived - 60);
    const windowEnd = Math.min(totalMonths - 1, windowStart + windowSize - 1);
    const dots: DotState[] = [];
    for (let i = windowStart; i <= windowEnd; i++) {
      dots.push(i < monthsLived ? 'used' : i === monthsLived ? 'current' : 'remaining');
    }
    return {
      dots,
      cols: 12,
      caption: `1 dot = 1 month  ·  years ${Math.floor(windowStart / 12) + 1}–${Math.floor(windowEnd / 12) + 1} of your life`,
    };
  }

  if (unit === 'weeks') {
    const yearStart = stats.yearsLived * 52;
    const weekInYear = stats.weeksLived - yearStart;
    const dots: DotState[] = Array.from({ length: 52 }, (_, i) =>
      i < weekInYear ? 'used' : i === weekInYear ? 'current' : 'remaining'
    );
    return {
      dots,
      cols: 13,
      caption: `1 dot = 1 week  ·  year ${stats.yearsLived + 1} of your life`,
    };
  }

  // days
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayOfMonth = today.getDate();
  const dots: DotState[] = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    return d < dayOfMonth ? 'used' : d === dayOfMonth ? 'current' : 'remaining';
  });
  return {
    dots,
    cols: 7,
    caption: `1 dot = 1 day  ·  ${today.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
  };
}

interface LifeDotsProps {
  stats: LifeStats;
  unit: Unit;
  today: Date;
}

export function LifeDots({ stats, unit, today }: LifeDotsProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const prevUnit = useRef<Unit | null>(null);

  const { dots, cols, caption } = computeDots(unit, stats, today);

  const availWidth = Dimensions.get('window').width - 48;
  const colWidth = availWidth / cols;
  const dotSize = Math.max(colWidth * 0.48, 6);

  useEffect(() => {
    if (prevUnit.current === null) {
      // First render — fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // Unit changed — cross-fade
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
    }
    prevUnit.current = unit;
  }, [unit]);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
        {dots.map((state, i) => {
          const isCurrent = state === 'current';
          return (
            <View
              key={i}
              style={{ width: colWidth, height: colWidth, alignItems: 'center', justifyContent: 'center' }}
            >
              <View
                style={[
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                    backgroundColor:
                      state === 'used'
                        ? colors.dotUsed
                        : isCurrent
                        ? colors.dotCurrent
                        : colors.dotRemaining,
                  },
                  isCurrent && {
                    shadowColor: colors.accent,
                    shadowRadius: dotSize * 1.2,
                    shadowOpacity: 1,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 12,
                  },
                ]}
              />
            </View>
          );
        })}
      </Animated.View>
      <Text style={[styles.caption, { color: colors.textTertiary }]}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  caption: {
    fontSize: 11,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
