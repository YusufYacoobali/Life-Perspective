import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  noPadding?: boolean;
}

export function Screen({ children, style, edges = ['top', 'bottom'], noPadding = false }: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={edges}
    >
      <View
        style={[
          styles.content,
          !noPadding && styles.padding,
          { backgroundColor: colors.background },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1 },
  padding: { paddingHorizontal: 24 },
});
