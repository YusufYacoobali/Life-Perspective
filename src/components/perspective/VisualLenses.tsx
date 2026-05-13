import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { formatNumber } from '../../lib/timeCalculations';

export type VisualLensKey = 'weekend' | 'birthday' | 'sunset' | 'constellation';

export interface VisualLensMetrics {
  summersLeft: number;
  weekendsLeft: number;
  birthdaysLeft: number;
  sunsetsLeft: number;
  monthsLeft: number;
  remainingPct: number;
  livedPct: number;
}

export const VISUAL_LENSES: Array<{
  key: VisualLensKey;
  index: number;
  title: string;
  subtitle: string;
}> = [
  { key: 'weekend', index: 1, title: 'Weekend Lights', subtitle: 'Each light is one weekend left.' },
  { key: 'birthday', index: 2, title: 'Birthday Rings', subtitle: 'Each ring is a birthday still ahead.' },
  { key: 'sunset', index: 3, title: 'Sunset', subtitle: 'One for every day remaining.' },
  { key: 'constellation', index: 4, title: 'Constellation', subtitle: 'Every star is a month waiting to happen.' },
];

export function PhoneShell({ children, tone = 'green' }: { children: React.ReactNode; tone?: 'green' | 'blue' | 'violet' | 'black' }) {
  const gradients = {
    green: ['#0A0F0E', '#1A2B20'] as [string, string],
    blue: ['#07101B', '#111B29'] as [string, string],
    violet: ['#100D18', '#1C1528'] as [string, string],
    black: ['#080B0F', '#0E1116'] as [string, string],
  };

  return (
    <View style={styles.phoneOuter}>
      <LinearGradient colors={gradients[tone]} style={styles.phoneInner}>
        {children}
        <View style={styles.homeIndicator} />
      </LinearGradient>
    </View>
  );
}

export function SummerTiles({ value, phase = 0 }: { value: number; phase?: number }) {
  const shown = Math.max(49, Math.min(84, value || 49));
  const marker = shown > 0 ? (phase * 5) % shown : 0;

  return (
    <PhoneShell tone="green">
      <View style={styles.phoneHeader}>
        <Ionicons name="sunny-outline" size={23} color="#F6B84B" />
        <Text style={styles.phoneTiny}>Summers Left</Text>
        <Text style={styles.phoneNumber}>{formatNumber(value)}</Text>
      </View>
      <View style={styles.tileGrid}>
        {Array.from({ length: shown }).map((_, i) => {
          const intensity = 1 - i / Math.max(shown, 1);
          return (
            <View
              key={i}
              style={[
                styles.summerTile,
                {
                  backgroundColor: i === marker ? '#FF8A47' : `rgba(246,184,75,${0.18 + intensity * 0.72})`,
                  transform: [{ scale: i === marker ? 1.11 : 1 }],
                },
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.phoneFooter}>Soak them in.</Text>
    </PhoneShell>
  );
}

export function WeekendLights({ value, phase = 0 }: { value: number; phase?: number }) {
  const shown = 192;
  const cols = 16;
  const marker = (phase * 11) % shown;

  return (
    <PhoneShell tone="blue">
      <View style={styles.phoneHeader}>
        <Text style={styles.phoneTiny}>Weekends Left</Text>
        <Text style={styles.phoneNumber}>{formatNumber(value)}</Text>
      </View>
      <Svg width="100%" height={222} viewBox="0 0 220 222">
        <Defs>
          <SvgLinearGradient id="lightGlow" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#FFE8B4" />
            <Stop offset="1" stopColor="#FF8A47" />
          </SvgLinearGradient>
        </Defs>
        {Array.from({ length: shown }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 12 + col * 13;
          const y = 18 + row * 14;
          const lit = ((i * 17 + phase * 5) % 13) < 4 || i === marker;
          return (
            <G key={i}>
              {lit ? <Circle cx={x} cy={y} r={6.2} fill="#FF8A47" opacity={0.15} /> : null}
              <Circle cx={x} cy={y} r={i === marker ? 3.6 : 2.55} fill={lit ? 'url(#lightGlow)' : '#3D4553'} opacity={lit ? 1 : 0.64} />
            </G>
          );
        })}
      </Svg>
      <Text style={styles.phoneFooter}>Little lights. Big life.</Text>
    </PhoneShell>
  );
}

export function BirthdayRings({ value, phase = 0 }: { value: number; phase?: number }) {
  const rings = Math.max(6, Math.min(18, value || 6));
  const active = rings > 0 ? phase % rings : 0;

  return (
    <PhoneShell tone="violet">
      <View style={styles.phoneHeader}>
        <Text style={styles.phoneTiny}>Birthdays Left</Text>
        <Text style={styles.phoneNumber}>{formatNumber(value)}</Text>
      </View>
      <Svg width="100%" height={238} viewBox="0 0 240 238">
        <Defs>
          <SvgLinearGradient id="ringStroke" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#FFB85C" />
            <Stop offset="0.52" stopColor="#D56EDB" />
            <Stop offset="1" stopColor="#55C7C1" />
          </SvgLinearGradient>
        </Defs>
        <Circle cx={120} cy={120} r={20} fill="#FFD19A" opacity={0.16} />
        <Path d="M112 102c-11 9-9 27 5 34 10 4 21 0 27-9-15 3-29-9-25-25z" fill="#FFD19A" />
        <Circle cx={138} cy={110} r={2.2} fill="#FFE8B4" />
        {Array.from({ length: rings }).map((_, i) => {
          const r = 31 + i * 8.2;
          const angle = ((i * 41 + phase * 21) % 360) * (Math.PI / 180);
          const x = 120 + Math.cos(angle) * r;
          const y = 120 + Math.sin(angle) * r;
          return (
            <G key={i}>
              <Circle cx={120} cy={120} r={r} stroke={i === active ? '#FF8A47' : 'url(#ringStroke)'} strokeWidth={i === active ? 1.9 : 0.9} opacity={i === active ? 1 : 0.64} fill="none" />
              <Circle cx={x} cy={y} r={i === active ? 3.7 : 2.3} fill={i === active ? '#FFDFB6' : '#9BC9D2'} />
            </G>
          );
        })}
      </Svg>
      <Text style={styles.phoneFooter}>Moments that return.</Text>
    </PhoneShell>
  );
}

export function Hourglass({ remainingPct, livedPct, phase = 0 }: { remainingPct: number; livedPct: number; phase?: number }) {
  const topCount = 64;
  const bottomCount = 45;

  return (
    <PhoneShell tone="black">
      <Text style={styles.motionLabel}>Life in Motion</Text>
      <Svg width="100%" height={308} viewBox="0 0 240 308">
        <Defs>
          <SvgLinearGradient id="glassStroke" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.85} />
            <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.56} />
          </SvgLinearGradient>
          <SvgLinearGradient id="glassFill" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.16} />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.02} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.1} />
          </SvgLinearGradient>
          <SvgLinearGradient id="goldMarble" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#FFF4D6" />
            <Stop offset="0.45" stopColor="#C8B18A" />
            <Stop offset="1" stopColor="#6C5B42" />
          </SvgLinearGradient>
          <SvgLinearGradient id="blackMarble" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#B9C0CB" />
            <Stop offset="0.45" stopColor="#555C68" />
            <Stop offset="1" stopColor="#11141A" />
          </SvgLinearGradient>
          <SvgLinearGradient id="sandStream" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor="#FFE8B4" stopOpacity={0.95} />
            <Stop offset="1" stopColor="#FFE8B4" stopOpacity={0.2} />
          </SvgLinearGradient>
        </Defs>

        <Ellipse cx={120} cy={32} rx={58} ry={11} fill="#FFFFFF" opacity={0.08} />
        <Path
          d="M68 29 C40 54 55 107 103 143 C55 181 39 238 68 271 C96 298 144 298 172 271 C201 238 185 181 137 143 C185 107 200 54 172 29 C145 8 95 8 68 29Z"
          fill="url(#glassFill)"
          stroke="url(#glassStroke)"
          strokeWidth={2.4}
        />
        <Path d="M82 42 C66 70 75 105 110 133" stroke="#FFFFFF" strokeOpacity={0.38} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Path d="M158 42 C174 70 165 105 130 133" stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Ellipse cx={120} cy={33} rx={56} ry={10} stroke="#FFFFFF" strokeOpacity={0.38} fill="none" />
        <Ellipse cx={120} cy={270} rx={56} ry={11} stroke="#FFFFFF" strokeOpacity={0.22} fill="none" />

        <Path d="M73 106 C96 126 145 126 167 106 C156 128 139 140 120 145 C101 140 84 128 73 106Z" fill="#C8B18A" opacity={0.24} />
        {Array.from({ length: topCount }).map((_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          const rowWidth = 10 - Math.max(0, row - 2);
          const x = 76 + col * 9.5 + ((row + phase) % 2) * 4 - Math.max(0, 10 - rowWidth) * 4;
          const y = 82 + row * 8.8 + Math.sin(i + phase) * 1.7;
          const visible = x > 62 && x < 178 && y < 138;
          return visible ? (
            <G key={`t${i}`}>
              <Circle cx={x + 1.5} cy={y + 2} r={5.5} fill="#000" opacity={0.2} />
              <Circle cx={x} cy={y} r={5.4} fill="url(#goldMarble)" opacity={0.94} />
              <Circle cx={x - 1.8} cy={y - 1.8} r={1.45} fill="#FFF9E8" opacity={0.86} />
            </G>
          ) : null;
        })}

        <Line x1={120} y1={139} x2={120} y2={214} stroke="url(#sandStream)" strokeWidth={2.2} strokeLinecap="round" />
        {[0, 1, 2, 3].map((i) => (
          <Circle key={`fall${i}`} cx={120 + Math.sin(phase + i) * 3} cy={160 + i * 17} r={3.1 - i * 0.25} fill="url(#goldMarble)" opacity={0.9 - i * 0.12} />
        ))}

        <Path d="M72 246 C92 222 149 222 169 246 C150 265 91 265 72 246Z" fill="#1F242B" opacity={0.72} />
        {Array.from({ length: bottomCount }).map((_, i) => {
          const row = Math.floor(i / 9);
          const col = i % 9;
          const x = 80 + col * 10 + ((row + phase) % 2) * 4;
          const y = 238 + row * 8.3 - Math.sin(i + phase) * 1.2;
          return (
            <G key={`b${i}`}>
              <Circle cx={x + 1.5} cy={y + 2} r={5.8} fill="#000" opacity={0.35} />
              <Circle cx={x} cy={y} r={5.5} fill="url(#blackMarble)" opacity={0.96} />
              <Circle cx={x - 1.6} cy={y - 1.7} r={1.2} fill="#DCE3EE" opacity={0.6} />
            </G>
          );
        })}

        <SvgText x={26} y={164} fontSize={8} fill="#A7A0A0">Remaining</SvgText>
        <SvgText x={26} y={182} fontSize={18} fill="#F7F2E8">{`${Math.round(remainingPct)}%`}</SvgText>
        <SvgText x={172} y={214} fontSize={8} fill="#A7A0A0">Lived</SvgText>
        <SvgText x={172} y={232} fontSize={18} fill="#F7F2E8">{`${Math.round(livedPct)}%`}</SvgText>
      </Svg>
      <Text style={styles.phoneFooter}>Time flows. Make it meaningful.</Text>
    </PhoneShell>
  );
}

export function LensVisual({ type, metrics, phase = 0 }: { type: VisualLensKey; metrics: VisualLensMetrics; phase?: number }) {
  switch (type) {
    case 'weekend':
      return <WeekendLights value={metrics.weekendsLeft} phase={phase} />;
    case 'birthday':
      return <BirthdayRings value={metrics.birthdaysLeft} phase={phase} />;
    case 'sunset':
      return <SummerTiles value={metrics.sunsetsLeft} phase={phase} />;
    case 'constellation':
      return <BirthdayRings value={metrics.monthsLeft} phase={phase} />;
  }
}

const styles = StyleSheet.create({
  phoneOuter: {
    height: 392,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#343946',
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.42,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  phoneInner: {
    flex: 1,
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    overflow: 'hidden',
  },
  phoneHeader: { alignItems: 'center', gap: 5, paddingTop: 8 },
  phoneTiny: { color: '#D9D4CA', fontSize: 11, fontWeight: '500' },
  phoneNumber: { color: '#F7F2E8', fontSize: 31, lineHeight: 36, fontWeight: '200' },
  tileGrid: {
    marginTop: 16,
    width: 190,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  summerTile: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  phoneFooter: {
    marginTop: 'auto',
    marginBottom: 8,
    color: '#A7A0A0',
    fontSize: 11,
    textAlign: 'center',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 9,
    width: 36,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.34)',
  },
  motionLabel: { color: '#D9D4CA', fontSize: 11, marginTop: 10, marginBottom: 2 },
});
