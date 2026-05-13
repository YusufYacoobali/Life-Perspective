import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';
import { formatNumber } from '../../src/lib/timeCalculations';
import { VISUAL_LENSES, VisualLensKey } from '../../src/components/perspective/VisualLenses';
import { buildLifeStages, buildPerspectiveMetrics, PerspectiveMetric } from '../../src/lib/perspectiveMetrics';

function MetricCard({ metric }: { metric: PerspectiveMetric }) {
  const { colors, isDark } = useTheme();
  const open = () => router.push(`/lens/metric/${metric.key}` as never);

  return (
    <Pressable
      onPress={open}
      style={[
        styles.metricCard,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.68)',
          borderColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(17,17,20,0.09)',
        },
      ]}
    >
      <View style={styles.metricTop}>
        <Ionicons name={metric.icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color={colors.accentWarm} />
        <Text style={[styles.metricTitle, { color: colors.text }]}>{metric.title}</Text>
      </View>
      <Text style={[styles.metricValue, { color: colors.text }]}>{formatNumber(metric.value)}</Text>
      <Text style={[styles.metricUnit, { color: colors.accentWarm }]}>{metric.unit}</Text>
      <Text style={[styles.metricCaption, { color: colors.textTertiary }]}>{metric.caption}</Text>
    </Pressable>
  );
}

function VisualLaunchCard({ lens }: { lens: (typeof VISUAL_LENSES)[number] }) {
  const { colors, isDark } = useTheme();
  const open = (type: VisualLensKey) => {
    router.push(`/lens/${type}` as never);
  };

  return (
    <Pressable
      onPress={() => open(lens.key)}
      style={[
        styles.visualCard,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.68)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(17,17,20,0.1)',
        },
      ]}
    >
      <View style={styles.visualBadge}>
        <Text style={[styles.visualIndex, { color: colors.accentWarm }]}>{lens.index}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.visualTitle, { color: colors.text }]}>{lens.title}</Text>
        <Text style={[styles.visualSubtitle, { color: colors.textSecondary }]}>{lens.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function PerspectiveScreen() {
  const { colors, isDark } = useTheme();
  const { profile, stats } = useUserProfile();
  const metrics = useMemo(() => (profile && stats ? buildPerspectiveMetrics(profile, stats) : []), [profile, stats]);
  const stages = useMemo(() => (profile && stats ? buildLifeStages(profile, stats) : []), [profile, stats]);

  if (!profile || !stats) return null;

  const gradientColors: [string, string, string] = isDark
    ? ['#07080A', '#121112', '#071415']
    : ['#F7F3EA', '#FFF6EF', '#EAF4F2'];
  const panelBg = isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.68)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(17,17,20,0.09)';

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.kicker, { color: colors.accentWarm }]}>PERSPECTIVE</Text>
            <Text style={[styles.title, { color: colors.text }]}>Make the abstract concrete.</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Tap a visual lens for a full-screen moment. Keep the counters for everyday perspective.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accentWarm }]}>VISUAL LENSES</Text>
            {VISUAL_LENSES.map((lens) => (
              <VisualLaunchCard key={lens.key} lens={lens} />
            ))}
          </View>

          <View style={styles.metricGrid}>
            {metrics.map((metric) => (
              <MetricCard key={metric.key} metric={metric} />
            ))}
          </View>

          <View style={[styles.stagePanel, { backgroundColor: panelBg, borderColor: panelBorder }]}>
            <Text style={[styles.sectionTitle, { color: colors.accentWarm }]}>LIFE STAGES</Text>
            {stages.map((stage) => (
              <View key={stage.title} style={styles.stageRow}>
                <View style={styles.stageTop}>
                  <Text style={[styles.stageTitle, { color: colors.text }]}>{stage.title}</Text>
                  <Text style={[styles.stageMeta, { color: colors.textTertiary }]}>
                    {stage.range} yrs / {stage.left.toFixed(1)} left
                  </Text>
                </View>
                <View style={[styles.stageTrack, { backgroundColor: colors.progressTrack }]}>
                  <View
                    style={[
                      styles.stageFill,
                      { width: `${stage.percentage}%`, backgroundColor: stage.percentage >= 100 ? colors.dotUsed : colors.accentWarm },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
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
  subtitle: { fontSize: 14, lineHeight: 21 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  visualCard: {
    minHeight: 72,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visualBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,71,0.12)',
  },
  visualIndex: { fontSize: 14, fontWeight: '800' },
  visualTitle: { fontSize: 16, fontWeight: '800' },
  visualSubtitle: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: {
    width: '48.4%',
    minHeight: 156,
    borderRadius: 8,
    borderWidth: 1,
    padding: 13,
    gap: 7,
  },
  metricTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metricTitle: { fontSize: 13, fontWeight: '800' },
  metricValue: { fontSize: 34, lineHeight: 39, fontWeight: '200' },
  metricUnit: { fontSize: 12, fontWeight: '800' },
  metricCaption: { fontSize: 11, lineHeight: 16 },
  stagePanel: { borderRadius: 8, borderWidth: 1, padding: 14, gap: 14 },
  stageRow: { gap: 7 },
  stageTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  stageTitle: { fontSize: 14, fontWeight: '700' },
  stageMeta: { fontSize: 11, textAlign: 'right' },
  stageTrack: { height: 7, borderRadius: 4, overflow: 'hidden' },
  stageFill: { height: 7, borderRadius: 4 },
});
