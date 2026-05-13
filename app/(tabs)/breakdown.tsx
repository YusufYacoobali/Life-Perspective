import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';
import { formatNumber } from '../../src/lib/timeCalculations';
import { ProgressRing } from '../../src/components/ProgressRing';

interface RowProps {
  label: string;
  lived: number;
  left: number;
  isLast?: boolean;
}

function LifeRow({ label, lived, left, isLast }: RowProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.lifeRow, !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.rowNumbers}>
        <View style={styles.rowNumBlock}>
          <Text style={[styles.rowNum, { color: colors.text }]}>{formatNumber(lived)}</Text>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>lived</Text>
        </View>
        <View style={styles.rowNumBlock}>
          <Text style={[styles.rowNum, { color: colors.accentWarm }]}>{formatNumber(left)}</Text>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>left</Text>
        </View>
      </View>
    </View>
  );
}

export default function BreakdownScreen() {
  const { colors, isDark } = useTheme();
  const { profile, stats } = useUserProfile();

  if (!profile || !stats) return null;

  const gradientColors: [string, string, string] = isDark
    ? ['#07080A', '#11161C', '#07080A']
    : ['#F7F3EA', '#F1EFE8', '#EAF4F2'];
  const panelBg = isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.68)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(17,17,20,0.09)';
  const dob = new Date(profile.dateOfBirth);
  const dobStr = dob.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const deathYear = new Date(stats.estimatedDeathDate).getFullYear();

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.kicker, { color: colors.accentWarm }]}>LIFE LEDGER</Text>
            <Text style={[styles.title, { color: colors.text }]}>A clean accounting of time.</Text>
          </View>

          <View style={[styles.heroPanel, { backgroundColor: panelBg, borderColor: panelBorder }]}>
            <ProgressRing percentage={stats.percentageLived} size={198} strokeWidth={8} color={colors.accentWarm} />
            <View style={styles.heroCopy}>
              <Text style={[styles.heroMeta, { color: colors.textTertiary }]}>Born {dobStr}</Text>
              <Text style={[styles.heroDeath, { color: colors.text }]}>Estimate reaches {deathYear}</Text>
              <Text style={[styles.heroSmall, { color: colors.textSecondary }]}>
                {stats.percentageRemaining.toFixed(1)}% of the estimate remains.
              </Text>
            </View>
          </View>

          <View style={[styles.panel, { backgroundColor: panelBg, borderColor: panelBorder }]}>
            <LifeRow label="Years" lived={stats.yearsLived} left={stats.yearsRemaining} />
            <LifeRow label="Months" lived={stats.monthsLived} left={stats.monthsRemaining} />
            <LifeRow label="Weeks" lived={stats.weeksLived} left={stats.weeksRemaining} />
            <LifeRow label="Days" lived={stats.daysLived} left={stats.daysRemaining} isLast />
          </View>

          <View style={styles.statGrid}>
            <View style={[styles.microPanel, { backgroundColor: panelBg, borderColor: panelBorder }]}>
              <Ionicons name="pulse-outline" size={18} color={colors.accent} />
              <Text style={[styles.microValue, { color: colors.text }]}>{formatNumber(stats.hoursRemaining)}</Text>
              <Text style={[styles.microLabel, { color: colors.textTertiary }]}>hours left</Text>
            </View>
            <View style={[styles.microPanel, { backgroundColor: panelBg, borderColor: panelBorder }]}>
              <Ionicons name="time-outline" size={18} color={colors.accent} />
              <Text style={[styles.microValue, { color: colors.text }]}>{formatNumber(stats.minutesRemaining)}</Text>
              <Text style={[styles.microLabel, { color: colors.textTertiary }]}>minutes left</Text>
            </View>
          </View>

          <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
            This is an approximate reflection tool, not a medical prediction.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 88, gap: 16 },
  header: { gap: 7 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 2.4 },
  title: { fontSize: 34, lineHeight: 40, fontWeight: '200' },
  heroPanel: { borderWidth: 1, borderRadius: 8, padding: 18, alignItems: 'center', gap: 12 },
  heroCopy: { alignItems: 'center', gap: 4 },
  heroMeta: { fontSize: 12 },
  heroDeath: { fontSize: 18, fontWeight: '600' },
  heroSmall: { fontSize: 13 },
  panel: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  lifeRow: { paddingHorizontal: 16, paddingVertical: 15, gap: 10 },
  rowLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase' },
  rowNumbers: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rowNumBlock: { flex: 1 },
  rowNum: { fontSize: 28, fontWeight: '200' },
  rowSub: { fontSize: 11, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' },
  statGrid: { flexDirection: 'row', gap: 10 },
  microPanel: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 14, gap: 6 },
  microValue: { fontSize: 22, fontWeight: '200' },
  microLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  disclaimer: { fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: 12 },
});
