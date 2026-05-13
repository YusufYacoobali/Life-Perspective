import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';
import { LifeGrid } from '../../src/components/home/LifeGrid';
import { TimeUnitToggle, Unit } from '../../src/components/home/TimeUnitToggle';
import { TodayFocusCard } from '../../src/components/home/TodayFocusCard';
import { getDailyQuote } from '../../src/lib/quotes';

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(target);
  const raf = useRef<number>(0);
  const previous = useRef(target);

  useEffect(() => {
    const start = Date.now();
    const from = previous.current;
    previous.current = target;
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(from + (target - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [duration, target]);

  return val;
}

function unitValue(stats: ReturnType<typeof useUserProfile>['stats'], unit: Unit) {
  if (!stats) return 0;
  switch (unit) {
    case 'years': return stats.yearsRemaining;
    case 'months': return stats.monthsRemaining;
    case 'weeks': return stats.weeksRemaining;
    case 'days': return stats.daysRemaining;
  }
}

function unitLabel(unit: Unit) {
  switch (unit) {
    case 'years': return 'years left';
    case 'months': return 'months left';
    case 'weeks': return 'weeks left';
    case 'days': return 'days left';
  }
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { profile, stats } = useUserProfile();
  const [unit, setUnit] = useState<Unit>('days');
  const { height } = useWindowDimensions();
  const quote = getDailyQuote();

  const display = useCountUp(stats ? unitValue(stats, unit) : 0);

  if (!profile || !stats) return null;
  const gradientColors: [string, string, string] = isDark
    ? ['#07080A', '#0D1718', '#07080A']
    : ['#F7F3EA', '#EAF4F2', '#F7F3EA'];
  const panelBg = isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.68)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(17,17,20,0.09)';
  const progress = Math.min(Math.max(stats.percentageLived, 0), 100);
  const gridHeight = Math.max(470, Math.round(height * 0.68));

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.kicker, { color: colors.accentWarm }]}>LIFE PERSPECTIVE</Text>
              <Text style={[styles.headerSub, { color: colors.textTertiary }]}>as of this moment</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/settings')}
              hitSlop={12}
              style={[styles.iconButton, { borderColor: panelBorder, backgroundColor: panelBg }]}
            >
              <Ionicons name="settings-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <Text style={[styles.heroNumber, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {display.toLocaleString()}
            </Text>
            <View style={styles.heroMeta}>
              <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>{unitLabel(unit)}</Text>
              <Text style={[styles.heroLine, { color: colors.textTertiary }]}>
                {stats.percentageLived.toFixed(1)}% used. {stats.percentageRemaining.toFixed(1)}% still ahead.
              </Text>
            </View>
          </View>

          <View style={[styles.gridPanel, { height: gridHeight, backgroundColor: panelBg, borderColor: panelBorder }]}>
            <View style={styles.gridVisual}>
              <LifeGrid stats={stats} unit={unit} />
            </View>
            <View style={styles.gridToggle}>
              <TimeUnitToggle unit={unit} onChange={setUnit} />
            </View>
          </View>

          <View style={[styles.progressShell, { backgroundColor: panelBg, borderColor: panelBorder }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Life progress</Text>
              <Text style={[styles.progressValue, { color: colors.accentWarm }]}>{progress.toFixed(1)}%</Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.progress }]} />
            </View>
          </View>

          <View style={[styles.quoteCard, { backgroundColor: panelBg, borderColor: panelBorder }]}>
            <Text style={[styles.quoteText, { color: colors.text }]}>
              "{quote.text}"
            </Text>
          </View>
          <TodayFocusCard />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 88 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 6,
  },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 2.4 },
  headerSub: { fontSize: 12, marginTop: 3 },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { paddingTop: 2, paddingBottom: 8 },
  heroNumber: {
    fontSize: 56,
    fontWeight: '100',
    lineHeight: 62,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 14,
  },
  heroLabel: { fontSize: 15, fontWeight: '700' },
  heroLine: { flex: 1, fontSize: 12, textAlign: 'right', lineHeight: 17 },
  progressShell: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 9,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 12, fontWeight: '600' },
  progressValue: { fontSize: 12, fontWeight: '800' },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 3 },
  gridPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  gridVisual: { flex: 1, minHeight: 0 },
  gridToggle: { alignItems: 'center', paddingTop: 8 },
  quoteCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    justifyContent: 'center',
    marginBottom: 10,
  },
  quoteText: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
});
