import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/theme';
import { loadProfile } from '../src/store/userProfileStore';
import { trackSessionAndMaybeReview } from '../src/lib/reviewPrompt';
import { registerNativeWidgetTaskHandler } from '../src/widgets/registerWidgetTaskHandler';

try {
  registerNativeWidgetTaskHandler();
} catch {
  // Native widgets require a dev/release build.
}

function RootStack() {
  const { isDark } = useTheme();

  useEffect(() => {
    loadProfile();
    trackSessionAndMaybeReview();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
