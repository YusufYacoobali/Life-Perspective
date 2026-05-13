import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { loadProfile } from '../src/store/userProfileStore';
import { UserProfile } from '../src/types/user';
import { useTheme } from '../src/theme';

export default function Index() {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);

  useEffect(() => {
    loadProfile().then(setProfile);
  }, []);

  if (profile === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!profile) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
