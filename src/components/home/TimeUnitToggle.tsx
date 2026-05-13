import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import { hapticSelection } from '../../lib/haptics';

export type Unit = 'years' | 'months' | 'weeks' | 'days';

const UNITS: { key: Unit; short: string; label: string }[] = [
  { key: 'years', short: 'Y', label: 'Years' },
  { key: 'months', short: 'M', label: 'Months' },
  { key: 'weeks', short: 'W', label: 'Weeks' },
  { key: 'days', short: 'D', label: 'Days' },
];

const TOGGLE_WIDTH = Math.min(Dimensions.get('window').width - 48, 320);
const TAB_WIDTH = TOGGLE_WIDTH / 4;

interface TimeUnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export function TimeUnitToggle({ unit, onChange }: TimeUnitToggleProps) {
  const { colors, isDark } = useTheme();
  const activeIndex = UNITS.findIndex((u) => u.key === unit);
  const indicatorX = useRef(new Animated.Value(activeIndex * TAB_WIDTH)).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: activeIndex * TAB_WIDTH,
      useNativeDriver: true,
      tension: 120,
      friction: 10,
    }).start();
  }, [activeIndex]);

  const trackBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const indicatorBg = isDark ? colors.surfaceElevated : colors.surface;

  return (
    <View style={[styles.track, { width: TOGGLE_WIDTH, backgroundColor: trackBg }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: TAB_WIDTH - 4,
            backgroundColor: indicatorBg,
            transform: [{ translateX: Animated.add(indicatorX, new Animated.Value(2)) }],
            shadowColor: colors.accent,
            shadowRadius: 8,
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />
      {UNITS.map((u, i) => (
        <TouchableOpacity
          key={u.key}
          onPress={() => { hapticSelection(); onChange(u.key); }}
          style={[styles.tab, { width: TAB_WIDTH }]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: u.key === unit ? colors.accent : colors.textTertiary,
                fontWeight: u.key === unit ? '600' : '400',
              },
            ]}
          >
            {u.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 12,
    height: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 9,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
