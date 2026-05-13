import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../../theme';
import { LifeStats } from '../../types/lifeStats';
import { Unit } from './TimeUnitToggle';

interface GridConfig {
  cols: number;
  total: number;
  lived: number;
  cell: number;
  dotR: number;
  dotSize: number;
  offsetX: number;
  offsetY: number;
  caption: string;
  dense: boolean;
}

function buildConfig(unit: Unit, stats: LifeStats, w: number, h: number): GridConfig {
  const make = (
    cols: number,
    total: number,
    lived: number,
    caption: string,
    dense = false,
  ): GridConfig => {
    const safeTotal = Math.max(Math.ceil(total), 1);
    const safeLived = Math.min(Math.max(Math.floor(lived), 0), safeTotal);
    const rows = Math.ceil(safeTotal / cols);
    const cell = Math.min(w / cols, h / rows);
    const gridW = cell * cols;
    const gridH = cell * rows;
    const dotSize = Math.max(cell * (dense ? 0.72 : 0.62), dense ? 0.85 : 2);

    return {
      cols,
      total: safeTotal,
      lived: safeLived,
      cell,
      dotR: dotSize / 2,
      dotSize,
      offsetX: (w - gridW) / 2,
      offsetY: (h - gridH) / 2,
      caption,
      dense,
    };
  };

  switch (unit) {
    case 'years':
      return make(
        10,
        stats.estimatedLifeExpectancyYears,
        stats.yearsLived,
        `1 mark = 1 year. Estimated ${stats.estimatedLifeExpectancyYears}-year lifespan.`,
      );
    case 'months': {
      const total = stats.estimatedLifeExpectancyYears * 12;
      return make(24, total, stats.monthsLived, `1 mark = 1 month. ${total.toLocaleString()} months total.`);
    }
    case 'weeks':
      return make(
        52,
        stats.estimatedLifeExpectancyYears * 52,
        stats.weeksLived,
        `1 mark = 1 week. ${stats.estimatedLifeExpectancyYears} rows of life.`,
      );
    case 'days': {
      const total = Math.max(stats.totalDaysEstimated, stats.daysLived + stats.daysRemaining, 1);
      const optCols = Math.max(90, Math.round(Math.sqrt(total * (w / Math.max(h, 1)))));
      return make(
        optCols,
        total,
        stats.daysLived,
        `1 mark = 1 day. ${total.toLocaleString()} estimated days in one life.`,
        true,
      );
    }
  }
}

function shardPath(cfg: GridConfig, start: number, end: number): string {
  if (end <= start) return '';

  const { cols, cell, dotSize, offsetX, offsetY } = cfg;
  const half = dotSize / 2;
  const parts: string[] = [];

  for (let i = start; i < end; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = offsetX + col * cell + cell / 2;
    const cy = offsetY + row * cell + cell / 2;
    const x = Number(cx.toFixed(2));
    const y = Number(cy.toFixed(2));
    const h = Number(half.toFixed(2));
    const inner = Number((half * 0.62).toFixed(2));
    parts.push(`M${x} ${y - h}l${inner} ${h}l-${inner} ${h}l-${inner} -${h}z`);
  }

  return parts.join('');
}

function singleShardPath(cx: number, cy: number, size: number): string {
  const half = size / 2;
  const inner = half * 0.68;
  return `M${cx} ${cy - half}l${inner} ${half}l-${inner} ${half}l-${inner} -${half}z`;
}

interface MarksProps {
  cfg: GridConfig;
  w: number;
  h: number;
  current: string;
  used: string;
  remain: string;
}

function Marks({ cfg, w, h, current, used, remain }: MarksProps) {
  const { cols, total, lived, cell, dotR, offsetX, offsetY, dense } = cfg;

  const { usedPath, remainPath, currentPoint } = useMemo(() => {
    const nextIndex = Math.min(lived, total - 1);
    const col = nextIndex % cols;
    const row = Math.floor(nextIndex / cols);
    const cx = offsetX + col * cell + cell / 2;
    const cy = offsetY + row * cell + cell / 2;

    return {
      usedPath: shardPath(cfg, 0, lived),
      remainPath: shardPath(cfg, Math.min(lived + 1, total), total),
      currentPoint: { cx, cy },
    };
  }, [cfg, cols, total, lived, cell, offsetX, offsetY]);

  return (
    <Svg width={w} height={h}>
      {remainPath ? <Path d={remainPath} fill={remain} /> : null}
      {usedPath ? <Path d={usedPath} fill={used} opacity={dense ? 0.9 : 1} /> : null}
      <Circle cx={currentPoint.cx} cy={currentPoint.cy} r={dotR * 5} fill={current} opacity={0.08} />
      <Circle cx={currentPoint.cx} cy={currentPoint.cy} r={dotR * 2.4} fill={current} opacity={0.24} />
      <Path
        d={singleShardPath(currentPoint.cx, currentPoint.cy, Math.max(dotR * 2.4, 3))}
        fill={current}
      />
    </Svg>
  );
}

interface LifeGridProps {
  stats: LifeStats;
  unit: Unit;
}

export function LifeGrid({ stats, unit }: LifeGridProps) {
  const { colors } = useTheme();
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const opacity = useRef(new Animated.Value(1)).current;
  const prevUnit = useRef<Unit | null>(null);

  useEffect(() => {
    if (prevUnit.current === null) {
      prevUnit.current = unit;
      return;
    }
    if (prevUnit.current === unit) return;
    prevUnit.current = unit;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: true }),
    ]).start();
  }, [opacity, unit]);

  const cfg = useMemo(
    () => (size ? buildConfig(unit, stats, size.w, size.h) : null),
    [unit, stats, size],
  );

  return (
    <View style={styles.outer}>
      <View
        style={styles.svgArea}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (width > 0 && height > 0) {
            setSize((prev) => (prev?.w === width && prev?.h === height ? prev : { w: width, h: height }));
          }
        }}
      >
        {cfg && size ? (
          <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
            <Marks
              cfg={cfg}
              w={size.w}
              h={size.h}
              current={colors.dotCurrent}
              used={colors.dotUsed}
              remain={colors.dotRemaining}
            />
          </Animated.View>
        ) : null}
      </View>

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
    letterSpacing: 0.4,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 2,
  },
});
