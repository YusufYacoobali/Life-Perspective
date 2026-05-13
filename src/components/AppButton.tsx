import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = true,
}: AppButtonProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const containerStyle: ViewStyle = {
    backgroundColor:
      variant === 'primary'
        ? colors.accent
        : variant === 'destructive'
        ? colors.destructive
        : 'transparent',
    borderColor:
      variant === 'secondary' ? colors.border : 'transparent',
    borderWidth: variant === 'secondary' ? 1 : 0,
    opacity: disabled ? 0.4 : 1,
  };

  const labelColor =
    variant === 'primary' || variant === 'destructive'
      ? '#FFFFFF'
      : variant === 'secondary'
      ? colors.text
      : colors.accent;

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
    md: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8 },
    lg: { paddingVertical: 18, paddingHorizontal: 24, borderRadius: 8 },
  }[size];

  const fontSizes = { sm: 14, md: 16, lg: 17 }[size];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        sizeStyles,
        containerStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <Text
          style={[styles.label, { color: labelColor, fontSize: fontSizes }, textStyle]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0,
  },
});
