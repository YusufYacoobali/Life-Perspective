import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '../../../src/theme';
import { useUserProfile } from '../../../src/store/userProfileStore';
import { formatNumber } from '../../../src/lib/timeCalculations';
import { getPerspectiveMetric, PerspectiveMetric } from '../../../src/lib/perspectiveMetrics';

function markPath(start: number, end: number, cols: number, cell: number, size: number, ox: number, oy: number) {
  const parts: string[] = [];
  const half = size / 2;
  const waist = half * 0.66;

  for (let i = start; i < end; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = ox + col * cell + cell / 2;
    const cy = oy + row * cell + cell / 2;
    parts.push(
      `M${cx.toFixed(2)} ${(cy - half).toFixed(2)}l${waist.toFixed(2)} ${half.toFixed(2)}l-${waist.toFixed(
        2,
      )} ${half.toFixed(2)}l-${waist.toFixed(2)} -${half.toFixed(2)}z`,
    );
  }

  return parts.join('');
}

function MetricMarkField({ metric, phase }: { metric: PerspectiveMetric; phase: number }) {
  const { colors, isDark } = useTheme();
  const maxMarks = 780;
  const displayTotal = Math.max(1, Math.min(metric.marks, maxMarks));
  const used = Math.min(displayTotal, Math.round((metric.usedMarks / Math.max(metric.marks, 1)) * displayTotal));
  const cols = displayTotal > 500 ? 30 : displayTotal > 220 ? 24 : displayTotal > 80 ? 16 : 10;
  const rows = Math.ceil(displayTotal / cols);
  const fieldW = 320;
  const fieldH = 500;
  const cell = Math.min(296 / cols, 430 / rows);
  const gridW = cell * cols;
  const gridH = cell * rows;
  const ox = (fieldW - gridW) / 2;
  const oy = 46 + (430 - gridH) / 2;
  const size = Math.max(3, Math.min(cell * 0.64, displayTotal > 500 ? 6 : 13));
  const current = Math.min(displayTotal - 1, Math.max(0, used));
  const currentCol = current % cols;
  const currentRow = Math.floor(current / cols);
  const currentX = ox + currentCol * cell + cell / 2;
  const currentY = oy + currentRow * cell + cell / 2;
  const active = Math.min(displayTotal - 1, Math.max(0, used + (phase % Math.max(1, displayTotal - used))));
  const activePath = markPath(active, active + 1, cols, cell, size * 1.4, ox, oy);

  const paths = useMemo(
    () => ({
      used: markPath(0, used, cols, cell, size, ox, oy),
      remain: markPath(used + 1, displayTotal, cols, cell, size, ox, oy),
    }),
    [cell, cols, displayTotal, ox, oy, size, used],
  );

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${fieldW} ${fieldH}`}>
      <Defs>
        <SvgLinearGradient id="remainMarks" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor={isDark ? '#313844' : '#E4D7C4'} />
          <Stop offset="1" stopColor={isDark ? '#171C24' : '#CFC3B2'} />
        </SvgLinearGradient>
        <SvgLinearGradient id="usedMarks" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor={isDark ? '#99D0D2' : '#1C6372'} />
          <Stop offset="1" stopColor={isDark ? '#486A78' : '#263D4A'} />
        </SvgLinearGradient>
        <SvgLinearGradient id="aliveMark" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor="#FFE6B8" />
          <Stop offset="1" stopColor={colors.accentWarm} />
        </SvgLinearGradient>
      </Defs>
      <Path d={paths.remain} fill="url(#remainMarks)" opacity={0.9} />
      <Path d={paths.used} fill="url(#usedMarks)" opacity={0.92} />
      {activePath ? <Path d={activePath} fill="url(#aliveMark)" /> : null}
      <Circle cx={currentX} cy={currentY} r={Math.max(size * 3.4, 12)} fill={colors.accentWarm} opacity={0.08} />
      <Circle cx={currentX} cy={currentY} r={Math.max(size * 1.7, 6)} fill={colors.accentWarm} opacity={0.18} />
    </Svg>
  );
}

export default function MetricDetailScreen() {
  const { colors, isDark } = useTheme();
  const { key } = useLocalSearchParams<{ key?: string }>();
  const { profile, stats } = useUserProfile();
  const [phase, setPhase] = useState(0);
  const { height } = useWindowDimensions();
  const metric = profile && stats ? getPerspectiveMetric(key, profile, stats) : null;

  if (!metric) return null;

  const gradientColors: [string, string, string] = isDark
    ? ['#050608', '#101018', '#050608']
    : ['#F7F3EA', '#FFF6EF', '#EAF4F2'];
  const compressed = metric.marks > 780;

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={25} color={colors.text} />
        </Pressable>

        <View style={styles.topText}>
          <View style={[styles.iconShell, { borderColor: colors.border }]}>
            <Ionicons name={metric.icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color={colors.accentWarm} />
          </View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{metric.title}</Text>
          <Text style={[styles.number, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
            {formatNumber(metric.value)}
          </Text>
          <Text style={[styles.unit, { color: colors.accentWarm }]}>{metric.unit}</Text>
        </View>

        <Pressable
          onPress={() => setPhase((prev) => prev + 1)}
          style={[
            styles.stage,
            {
              minHeight: Math.max(430, height * 0.66),
              backgroundColor: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.56)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,20,0.08)',
            },
          ]}
        >
          <MetricMarkField metric={metric} phase={phase} />
        </Pressable>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          {metric.markLabel}
          {compressed ? ' / compressed to fit' : ''}. {metric.caption}
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16 },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 13,
    zIndex: 2,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 7,
  },
  iconShell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  label: { fontSize: 13, fontWeight: '600' },
  number: { fontSize: 43, lineHeight: 49, fontWeight: '200', marginTop: 2, maxWidth: '92%' },
  unit: { fontSize: 12, fontWeight: '800' },
  stage: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  footer: { textAlign: 'center', fontSize: 11, lineHeight: 16, paddingTop: 8, paddingBottom: 14 },
});
