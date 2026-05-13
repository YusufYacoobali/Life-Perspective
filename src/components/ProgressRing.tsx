import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: string;
}

export function ProgressRing({
  percentage,
  size = 220,
  strokeWidth = 10,
  showLabel = true,
  color,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const strokeColor = color ?? colors.progress;
  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedPct / 100);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.progressTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.percentText,
              { color: colors.text },
            ]}
          >
            {clampedPct.toFixed(1)}%
          </Text>
          <Text style={[styles.usedLabel, { color: colors.textSecondary }]}>
            used
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: 'center',
  },
  percentText: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 50,
  },
  usedLabel: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
