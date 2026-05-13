import React, { useMemo, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';
import { VisualLensKey } from '../../src/components/perspective/VisualLenses';
import { formatNumber } from '../../src/lib/timeCalculations';

const lensBackgrounds = {
  sunset: require('../../assets/lens/sunset-bg.png'),
  constellation: require('../../assets/lens/constellation-bg.png'),
};

interface VisualMetrics {
  weekendsLeft: number;
  birthdaysLeft: number;
  sunsetsLeft: number;
  monthsLeft: number;
  remainingPct: number;
  livedPct: number;
}

function ageYears(dateString: string) {
  const dob = new Date(dateString);
  return Math.max(0, (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

function useVisualMetrics(): VisualMetrics | null {
  const { profile, stats } = useUserProfile();

  return useMemo(() => {
    if (!profile || !stats) return null;
    return {
      weekendsLeft: Math.max(0, Math.floor(stats.daysRemaining / 7)),
      birthdaysLeft: Math.max(0, Math.ceil(stats.estimatedLifeExpectancyYears - ageYears(profile.dateOfBirth))),
      sunsetsLeft: Math.max(0, stats.daysRemaining),
      monthsLeft: Math.max(0, stats.monthsRemaining),
      remainingPct: Math.min(Math.max(stats.percentageRemaining, 0), 100),
      livedPct: Math.min(Math.max(stats.percentageLived, 0), 100),
    };
  }, [profile, stats]);
}

function isVisualLensKey(value: unknown): value is VisualLensKey {
  return value === 'weekend' || value === 'birthday' || value === 'sunset' || value === 'constellation';
}

function lensCopy(type: VisualLensKey, metrics: VisualMetrics) {
  switch (type) {
    case 'weekend':
      return { label: 'Weekends Left', value: metrics.weekendsLeft, footer: 'Little lights. Big life.' };
    case 'birthday':
      return { label: 'Birthdays Left', value: metrics.birthdaysLeft, footer: 'Moments that return.' };
    case 'sunset':
      return { label: 'Sunsets Left', value: metrics.sunsetsLeft, footer: 'Beautiful endings. Every day.' };
    case 'constellation':
      return { label: 'Months Left', value: metrics.monthsLeft, footer: 'Tap to connect your stars.' };
  }
}

// ─────────────────────────────────────────────────────────
// WEEKEND DOTS
// ─────────────────────────────────────────────────────────
function WeekendScene({ phase }: { phase: number }) {
  const shown = 420;
  const cols = 20;
  const marker = (phase * 17) % shown;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 320 500">
      <Defs>
        <SvgLinearGradient id="weekendLight" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor="#FFE8B4" />
          <Stop offset="1" stopColor="#FF8A47" />
        </SvgLinearGradient>
      </Defs>
      {Array.from({ length: shown }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 14 + col * 15.4;
        const y = 22 + row * 18.6;
        const lit = ((i * 17 + phase * 7) % 13) < 4 || i === marker;
        return (
          <G key={i}>
            {lit ? <Circle cx={x} cy={y} r={8} fill="#FF8A47" opacity={0.13} /> : null}
            <Circle
              cx={x} cy={y}
              r={i === marker ? 4.1 : 2.9}
              fill={lit ? 'url(#weekendLight)' : '#465061'}
              opacity={lit ? 1 : 0.62}
            />
          </G>
        );
      })}
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────
// BIRTHDAY RINGS — adaptive ring spacing, scaled moon
// ─────────────────────────────────────────────────────────
function BirthdayScene({ value, phase }: { value: number; phase: number }) {
  const rings = Math.max(7, Math.min(22, value || 7));
  const active = phase % rings;
  const minR = 28;
  const maxR = 150;
  const spacing = rings > 1 ? (maxR - minR) / (rings - 1) : 0;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 320 500">
      <Defs>
        <SvgLinearGradient id="ringStrokeFull" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor="#FFB85C" />
          <Stop offset="0.48" stopColor="#D56EDB" />
          <Stop offset="1" stopColor="#55C7C1" />
        </SvgLinearGradient>
      </Defs>

      {/* Scaled-down crescent moon center */}
      <Circle cx={160} cy={250} r={12} fill="#FFD19A" opacity={0.12} />
      <Path d="M149 238c-8 6-7 19 4 23 7 3 15 0 19-6-11 2-20-6-18-17z" fill="#FFD19A" />
      <Circle cx={166} cy={243} r={1.8} fill="#FFE8B4" />

      {Array.from({ length: rings }).map((_, i) => {
        const r = minR + i * spacing;
        const angle = ((i * 41 + phase * 21) % 360) * (Math.PI / 180);
        const ox = parseFloat((160 + Math.cos(angle) * r).toFixed(2));
        const oy = parseFloat((250 + Math.sin(angle) * r).toFixed(2));
        const isActive = i === active;
        return (
          <G key={i}>
            <Circle
              cx={160} cy={250} r={r}
              stroke={isActive ? '#FF8A47' : 'url(#ringStrokeFull)'}
              strokeWidth={isActive ? 1.8 : 0.9}
              opacity={isActive ? 1 : 0.65}
              fill="none"
            />
            <Circle cx={ox} cy={oy} r={isActive ? 3.5 : 2} fill={isActive ? '#FFDFB6' : '#9BC9D2'} />
          </G>
        );
      })}
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────
// SUNSET — background photo only, no SVG overlay
// ─────────────────────────────────────────────────────────
function SunsetScene() {
  return (
    <ImageBackground source={lensBackgrounds.sunset} style={styles.sceneBg} imageStyle={styles.sceneImage}>
      <LinearGradient
        colors={['rgba(5,6,20,0.25)', 'rgba(5,6,20,0)', 'rgba(4,5,14,0.5)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </ImageBackground>
  );
}

// ─────────────────────────────────────────────────────────
// CONSTELLATION — branching network reveals star by star
// Stars flow top→bottom with wide branches going both ways
// ─────────────────────────────────────────────────────────
const STARS = [
  [160, 42],   // 0  apex
  [95, 76],    // 1  upper-left
  [228, 72],   // 2  upper-right
  [52, 118],   // 3  far-left
  [145, 110],  // 4  center-left
  [202, 116],  // 5  center-right
  [272, 100],  // 6  far-right
  [82, 162],   // 7  mid-left
  [162, 156],  // 8  center
  [244, 168],  // 9  mid-right
  [38, 214],   // 10 far-left
  [118, 222],  // 11 mid-center-left
  [200, 212],  // 12 mid-center-right
  [280, 228],  // 13 far-right
  [72, 272],   // 14 lower-left
  [152, 266],  // 15 lower-center-left
  [232, 276],  // 16 lower-center-right
  [106, 324],  // 17 bottom-left
  [186, 318],  // 18 bottom-center
  [258, 336],  // 19 bottom-right
  [142, 376],  // 20 near-bottom-left
  [210, 382],  // 21 near-bottom-right
  [178, 438],  // 22 nadir
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2],
  [1, 3], [1, 4], [2, 5], [2, 6],
  [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9],
  [7, 10], [7, 11], [8, 11], [8, 12], [9, 12], [9, 13],
  [10, 14], [11, 14], [11, 15], [12, 15], [12, 16], [13, 16],
  [14, 17], [15, 17], [15, 18], [16, 18], [16, 19],
  [17, 20], [18, 20], [18, 21], [19, 21],
  [20, 22], [21, 22],
];

function ConstellationScene({ phase }: { phase: number }) {
  const total = STARS.length;
  const revealed = phase % (total + 1); // 0 = blank, total = all connected
  const allDone = revealed === total;

  return (
    <ImageBackground source={lensBackgrounds.constellation} style={styles.sceneBg} imageStyle={styles.sceneImage}>
      <LinearGradient
        colors={['rgba(3,6,17,0.14)', 'rgba(3,6,17,0)', 'rgba(3,6,17,0.52)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <Svg width="100%" height="100%" viewBox="0 0 320 500">
        {/* Edges: draw only between revealed stars */}
        {EDGES.map(([a, b], i) => {
          if (a >= revealed || b >= revealed) return null;
          return (
            <Line
              key={i}
              x1={STARS[a][0]} y1={STARS[a][1]}
              x2={STARS[b][0]} y2={STARS[b][1]}
              stroke={allDone ? '#C8AAFB' : '#E6D0FF'}
              strokeOpacity={allDone ? 0.52 : 0.28}
              strokeWidth={allDone ? 1.1 : 0.85}
            />
          );
        })}

        {/* Stars */}
        {STARS.map(([x, y], i) => {
          const isRevealed = i < revealed;
          const isNew = i === revealed - 1;
          const isNext = i === revealed && !allDone;

          if (isNext) {
            return (
              <G key={i}>
                <Circle cx={x} cy={y} r={8} fill="#FFDDB8" opacity={0.1} />
                <Circle cx={x} cy={y} r={1.8} fill="#FFF4E0" opacity={0.42} />
              </G>
            );
          }

          if (!isRevealed) {
            return <Circle key={i} cx={x} cy={y} r={1.1} fill="#FFDDB8" opacity={0.1} />;
          }

          return (
            <G key={i}>
              <Circle
                cx={x} cy={y}
                r={isNew ? 15 : allDone ? 9 : 6}
                fill="#FFDDB8"
                opacity={isNew ? 0.24 : allDone ? 0.16 : 0.09}
              />
              <Circle cx={x} cy={y} r={isNew ? 3.8 : allDone ? 3 : 2.2} fill="#FFF4E0" />
            </G>
          );
        })}
      </Svg>
    </ImageBackground>
  );
}

function FullScreenVisual({ type, metrics, phase }: { type: VisualLensKey; metrics: VisualMetrics; phase: number }) {
  switch (type) {
    case 'weekend':
      return <WeekendScene phase={phase} />;
    case 'birthday':
      return <BirthdayScene value={metrics.birthdaysLeft} phase={phase} />;
    case 'sunset':
      return <SunsetScene />;
    case 'constellation':
      return <ConstellationScene phase={phase} />;
  }
}

export default function LensDetailScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{ type?: string }>();
  const type = isVisualLensKey(params.type) ? params.type : 'weekend';
  const metrics = useVisualMetrics();
  const [phase, setPhase] = useState(0);
  const { height } = useWindowDimensions();

  if (!metrics) return null;

  const copy = lensCopy(type, metrics);
  const suffix = 'suffix' in copy && typeof copy.suffix === 'string' ? copy.suffix : '';
  const gradientColors: [string, string, string] = isDark
    ? ['#050608', '#101018', '#050608']
    : ['#F7F3EA', '#FFF6EF', '#EAF4F2'];

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={25} color={colors.text} />
        </Pressable>

        <View style={styles.topText}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{copy.label}</Text>
          <Text style={[styles.number, { color: colors.text }]}>
            {formatNumber(copy.value)}
            {suffix}
          </Text>
        </View>

        <Pressable
          onPress={() => setPhase((prev) => prev + 1)}
          style={[styles.visualStage, { minHeight: Math.max(420, height * 0.68) }]}
        >
          <FullScreenVisual type={type} metrics={metrics} phase={phase} />
        </Pressable>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>{copy.footer}</Text>
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
    paddingTop: 34,
    paddingBottom: 4,
  },
  label: { fontSize: 13, fontWeight: '600' },
  number: { fontSize: 42, lineHeight: 48, fontWeight: '200', marginTop: 4 },
  visualStage: { flex: 1 },
  footer: { textAlign: 'center', fontSize: 12, paddingTop: 4, paddingBottom: 14 },
  sceneBg: { flex: 1, overflow: 'hidden', borderRadius: 28 },
  sceneImage: { resizeMode: 'cover' },
});
