import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';
import { LifeGrid } from '../../src/components/home/LifeGrid';
import { TimeUnitToggle, Unit } from '../../src/components/home/TimeUnitToggle';

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(target);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = Date.now();
    const from = 0;
    const to = target;
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target]);

  return val;
}

function unitValue(stats: ReturnType<typeof useUserProfile>['stats'], unit: Unit) {
  if (!stats) return 0;
  switch (unit) {
    case 'years':  return stats.yearsRemaining;
    case 'months': return stats.monthsRemaining;
    case 'weeks':  return stats.weeksRemaining;
    case 'days':   return stats.daysRemaining;
  }
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { profile, stats } = useUserProfile();
  const [unit, setUnit] = useState<Unit>('weeks');

  if (!profile || !stats) return null;

  const gradientColors: [string, string] = isDark
    ? ['#0C0C12', '#070709']
    : ['#FAF7F3', '#F5F2EE'];

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* ── Header ─────────────────────────────── */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.textTertiary }]}>TIME LEFT</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} hitSlop={12}>
            <Text style={[styles.gear, { color: colors.textTertiary }]}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* ── Compact hero ───────────────────────── */}
        <HeroRow stats={stats} unit={unit} colors={colors} />

        {/* ── Toggle ─────────────────────────────── */}
        <View style={styles.toggleRow}>
          <TimeUnitToggle unit={unit} onChange={setUnit} />
        </View>

        {/* ── Grid — fills ALL remaining space ───── */}
        <View style={styles.gridWrapper}>
          <LifeGrid stats={stats} unit={unit} />
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── hero row ────────────────────────────────────────────────────────────────

interface HeroRowProps {
  stats: NonNullable<ReturnType<typeof useUserProfile>['stats']>;
  unit: Unit;
  colors: ReturnType<typeof useTheme>['colors'];
}

function HeroRow({ stats, unit, colors }: HeroRowProps) {
  const target = unitValue(stats, unit);
  const display = useCountUp(target);

  const label = { years: 'YEARS', months: 'MONTHS', weeks: 'WEEKS', days: 'DAYS' }[unit];

  return (
    <View style={styles.hero}>
      <Text style={[styles.heroNum, { color: colors.text }]}>
        {display.toLocaleString()}
      </Text>
      <View style={styles.heroRight}>
        <Text style={[styles.heroUnit, { color: colors.textSecondary }]}>{label} LEFT</Text>
        <Text style={[styles.heroPct, { color: colors.accentWarm }]}>
          {stats.percentageRemaining.toFixed(1)}% remaining
        </Text>
      </View>
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 4,
  },
  appName: { fontSize: 10, fontWeight: '600', letterSpacing: 3.5 },
  gear: { fontSize: 17 },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    gap: 12,
  },
  heroNum: {
    fontSize: 56,
    fontWeight: '100',
    letterSpacing: -2.5,
    lineHeight: 60,
  },
  heroRight: { gap: 3 },
  heroUnit: { fontSize: 11, fontWeight: '600', letterSpacing: 2 },
  heroPct: { fontSize: 11, fontWeight: '400' },

  toggleRow: {
    alignItems: 'center',
    paddingBottom: 8,
  },

  gridWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
});
