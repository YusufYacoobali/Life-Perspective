import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../theme';
import { LifeStats } from '../../types/lifeStats';
import { Unit } from './TimeUnitToggle';

// ─── config ──────────────────────────────────────────────────────────────────

interface GridConfig {
  cols: number;
  total: number;
  lived: number;
  cell: number;
  dotR: number;
  offsetX: number;
  offsetY: number;
  caption: string;
}

function buildConfig(
  unit: Unit,
  stats: LifeStats,
  w: number,
  h: number,
): GridConfig {
  const make = (
    cols: number,
    total: number,
    lived: number,
    caption: string,
  ): GridConfig => {
    const rows = Math.ceil(total / cols);
    const cell = Math.min(w / cols, h / rows);
    const gridW = cell * cols;
    const gridH = cell * rows;
    return {
      cols,
      total,
      lived,
      cell,
      dotR: cell * 0.36,
      offsetX: (w - gridW) / 2,
      offsetY: (h - gridH) / 2,
      caption,
    };
  };

  switch (unit) {
    case 'years':
      return make(
        10,
        stats.estimatedLifeExpectancyYears,
        stats.yearsLived,
        `1 dot = 1 year  ·  est. ${stats.estimatedLifeExpectancyYears}-year lifespan`,
      );

    case 'months': {
      // 24 cols → 2 years per row, near-square cells
      const total = stats.estimatedLifeExpectancyYears * 12;
      return make(
        24,
        total,
        stats.monthsLived,
        `1 dot = 1 month  ·  ${total} months`,
      );
    }

    case 'weeks':
      // 52 cols → 1 year per row, the classic "life in weeks"
      return make(
        52,
        stats.estimatedLifeExpectancyYears * 52,
        stats.weeksLived,
        `1 dot = 1 week  ·  52 per row  ·  ${stats.estimatedLifeExpectancyYears} rows`,
      );

    case 'days': {
      // Current year — 7 cols calendar grid
      const now = new Date();
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const dayOfYear = Math.floor(
        (now.getTime() - yearStart.getTime()) / 86_400_000,
      );
      const isLeap =
        (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) ||
        now.getFullYear() % 400 === 0;
      const total = isLeap ? 366 : 365;
      // Find cols that maximises cell size (near-square)
      const optCols = Math.max(7, Math.round(Math.sqrt(total * w / h)));
      return make(
        optCols,
        total,
        dayOfYear,
        `1 dot = 1 day  ·  ${now.getFullYear()}`,
      );
    }
  }
}

// ─── circles memo ────────────────────────────────────────────────────────────

interface CirclesProps {
  cfg: GridConfig;
  w: number;
  h: number;
  gold: string;
  used: string;
  remain: string;
}

function Circles({ cfg, w, h, gold, used, remain }: CirclesProps) {
  const { cols, total, lived, cell, dotR, offsetX, offsetY } = cfg;

  const els = useMemo(() => {
    const out: React.ReactElement[] = [];
    for (let i = 0; i < total; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = offsetX + col * cell + cell / 2;
      const cy = offsetY + row * cell + cell / 2;

      if (i === lived) {
        out.push(
          <Circle key={`g2_${i}`} cx={cx} cy={cy} r={dotR * 3.8} fill={gold} opacity={0.08} />,
          <Circle key={`g1_${i}`} cx={cx} cy={cy} r={dotR * 2.1} fill={gold} opacity={0.25} />,
          <Circle key={`gc_${i}`} cx={cx} cy={cy} r={dotR} fill={gold} />,
        );
      } else {
        out.push(
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={dotR}
            fill={i < lived ? used : remain}
          />,
        );
      }
    }
    return out;
  }, [cols, total, lived, cell, dotR, offsetX, offsetY, gold, used, remain]);

  return (
    <Svg width={w} height={h}>
      {els}
    </Svg>
  );
}

// ─── public component ────────────────────────────────────────────────────────

interface LifeGridProps {
  stats: LifeStats;
  unit: Unit;
}

export function LifeGrid({ stats, unit }: LifeGridProps) {
  const { colors } = useTheme();
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const opacity = useRef(new Animated.Value(1)).current;
  const prevUnit = useRef<Unit | null>(null);

  // Cross-fade on unit switch
  useEffect(() => {
    if (prevUnit.current === null) {
      prevUnit.current = unit;
      return;
    }
    if (prevUnit.current === unit) return;
    prevUnit.current = unit;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [unit]);

  const cfg = useMemo(
    () => (size ? buildConfig(unit, stats, size.w, size.h) : null),
    [unit, stats, size],
  );

  return (
    <View style={styles.outer}>
      {/* SVG area: flex:1 so it fills whatever height the parent gives */}
      <View
        style={styles.svgArea}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (width > 0 && height > 0) {
            setSize({ w: width, h: height });
          }
        }}
      >
        {cfg && size && (
          <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
            <Circles
              cfg={cfg}
              w={size.w}
              h={size.h}
              gold={colors.dotCurrent}
              used={colors.dotUsed}
              remain={colors.dotRemaining}
            />
          </Animated.View>
        )}
      </View>

      {/* Caption pinned below */}
      <Text style={[styles.caption, { color: colors.textTertiary }]}>
        {cfg?.caption ?? ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  svgArea: { flex: 1 },
  caption: {
    fontSize: 10,
    letterSpacing: 0.6,
    textAlign: 'center',
    paddingTop: 6,
    paddingBottom: 2,
  },
});
