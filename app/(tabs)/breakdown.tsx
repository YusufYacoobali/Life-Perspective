import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';
import { formatNumber } from '../../src/lib/timeCalculations';
import { ProgressRing } from '../../src/components/ProgressRing';

interface BigStatProps {
  value: number;
  unit: string;
  sublabel?: string;
  isLast?: boolean;
}

function BigStat({ value, unit, sublabel, isLast }: BigStatProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.bigStat, !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.bigStatNum, { color: colors.text }]}>{formatNumber(value)}</Text>
      <View style={styles.bigStatRight}>
        <Text style={[styles.bigStatUnit, { color: colors.textSecondary }]}>{unit}</Text>
        {sublabel ? <Text style={[styles.bigStatSub, { color: colors.textTertiary }]}>{sublabel}</Text> : null}
      </View>
    </View>
  );
}

interface CompactStatProps {
  label: string;
  value: number;
  isLast?: boolean;
}

function CompactStat({ label, value, isLast }: CompactStatProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.compactStat, !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.compactLabel, { color: colors.textTertiary }]}>{label}</Text>
      <Text style={[styles.compactValue, { color: colors.textSecondary }]}>{formatNumber(value)}</Text>
    </View>
  );
}

export default function BreakdownScreen() {
  const { colors, isDark } = useTheme();
  const { profile, stats } = useUserProfile();

  const gradientColors: [string, string] = isDark
    ? ['#0A0A10', '#070709']
    : ['#FAF7F3', '#F5F2EE'];

  if (!profile || !stats) return null;

  const dob = new Date(profile.dateOfBirth);
  const dobStr = dob.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const deathYear = new Date(stats.estimatedDeathDate).getFullYear();

  const cardBg = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <Text style={[styles.screenTitle, { color: colors.text }]}>Your Life</Text>

          {/* Hero ring */}
          <View style={styles.ringSection}>
            <ProgressRing
              percentage={stats.percentageLived}
              size={200}
              strokeWidth={7}
              color={colors.accentWarm}
            />
            <Text style={[styles.ringCaption, { color: colors.textTertiary }]}>
              Born {dobStr}  ·  Est. ~{deathYear}
            </Text>
          </View>

          {/* STILL AHEAD */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: colors.accentWarm }]}>STILL AHEAD</Text>
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <BigStat value={stats.yearsRemaining} unit="years" />
              <BigStat value={stats.monthsRemaining} unit="months" />
              <BigStat value={stats.weeksRemaining} unit="weeks" />
              <BigStat value={stats.daysRemaining} unit="days" isLast />
            </View>
          </View>

          {/* Extended */}
          <View style={[styles.extRow, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.extItem}>
              <Text style={[styles.extNumber, { color: colors.text }]}>
                {formatNumber(stats.hoursRemaining)}
              </Text>
              <Text style={[styles.extLabel, { color: colors.textTertiary }]}>hours left</Text>
            </View>
            <View style={[styles.extDiv, { backgroundColor: colors.border }]} />
            <View style={styles.extItem}>
              <Text style={[styles.extNumber, { color: colors.text }]}>
                {formatNumber(stats.minutesRemaining)}
              </Text>
              <Text style={[styles.extLabel, { color: colors.textTertiary }]}>minutes left</Text>
            </View>
          </View>

          {/* BEHIND YOU */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>BEHIND YOU</Text>
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <CompactStat label="years" value={stats.yearsLived} />
              <CompactStat label="months" value={stats.monthsLived} />
              <CompactStat label="weeks" value={stats.weeksLived} />
              <CompactStat label="days" value={stats.daysLived} isLast />
            </View>
          </View>

          <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
            Statistical estimates only. Your actual lifespan depends on many factors.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48, gap: 24 },
  screenTitle: { fontSize: 28, fontWeight: '200', letterSpacing: -1 },
  ringSection: { alignItems: 'center', gap: 12 },
  ringCaption: { fontSize: 12 },
  sectionBlock: { gap: 8 },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  bigStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bigStatNum: { fontSize: 36, fontWeight: '100', letterSpacing: -1.5 },
  bigStatRight: { alignItems: 'flex-end', gap: 2 },
  bigStatUnit: { fontSize: 14, fontWeight: '400', letterSpacing: 0.5 },
  bigStatSub: { fontSize: 11 },
  compactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  compactLabel: { fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  compactValue: { fontSize: 18, fontWeight: '200' },
  extRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  extItem: { flex: 1, alignItems: 'center', paddingVertical: 18, gap: 4 },
  extDiv: { width: 1 },
  extNumber: { fontSize: 22, fontWeight: '200', letterSpacing: -0.5 },
  extLabel: { fontSize: 11 },
  disclaimer: { fontSize: 11, textAlign: 'center', lineHeight: 18 },
});
