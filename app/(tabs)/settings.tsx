import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme, ThemeMode } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';

// ─── primitives ──────────────────────────────────────────────────────────────

function Row({
  label,
  value,
  onPress,
  destructive,
  isLast,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  isLast?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.55 : 1}
      style={[
        styles.row,
        !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <Text style={[styles.rowLabel, { color: destructive ? colors.destructive : colors.text }]}>
        {label}
      </Text>
      {value != null && (
        <Text style={[styles.rowValue, { color: colors.textTertiary }]}>{value}</Text>
      )}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.section}>
      {title != null && (
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>{title}</Text>
      )}
      <View style={[
        styles.sectionCard,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)',
          borderColor: isDark ? 'rgba(255,255,255,0.055)' : 'rgba(0,0,0,0.055)',
        },
      ]}>
        {children}
      </View>
    </View>
  );
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { colors, isDark, mode, setMode } = useTheme();
  const { profile, stats, clear } = useUserProfile();

  const gradientColors: [string, string] = isDark
    ? ['#0C0C12', '#070709']
    : ['#FAF7F3', '#F5F2EE'];

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete your profile and all settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clear();
            router.replace('/onboarding');
          },
        },
      ],
    );
  };

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.screenTitle, { color: colors.text }]}>Settings</Text>

          {/* Profile info */}
          {profile && stats && (
            <Section title="PROFILE">
              <Row label={profile.countryName} value="Country" />
              <Row
                label={new Date(profile.dateOfBirth).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
                value="Date of birth"
              />
              <Row label={profile.gender === 'male' ? 'Male' : 'Female'} value="Sex" />
              <Row
                label={`~${stats.estimatedLifeExpectancyYears} years`}
                value="Est. lifespan"
                isLast
              />
            </Section>
          )}

          {/* Edit profile */}
          {profile && (
            <TouchableOpacity
              onPress={() => router.push('/onboarding')}
              style={[styles.editBtn, { borderColor: colors.accentWarm }]}
            >
              <Text style={[styles.editBtnText, { color: colors.accentWarm }]}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          {/* Appearance */}
          <Section title="APPEARANCE">
            <View style={styles.themeRow}>
              {themeOptions.map((opt) => {
                const active = mode === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setMode(opt.value)}
                    style={[
                      styles.themeBtn,
                      {
                        backgroundColor: active ? colors.accentWarm : 'transparent',
                        borderColor: active ? colors.accentWarm : colors.border,
                      },
                    ]}
                  >
                    <Text style={[
                      styles.themeBtnText,
                      { color: active ? '#fff' : colors.textSecondary },
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          {/* About */}
          <Section title="ABOUT">
            <Row label="Time Left" value="v1.0.0" isLast />
          </Section>

          {/* Disclaimer */}
          <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
            This app provides an approximate life expectancy estimate based on statistical and
            lifestyle factors. For reflection only — not medical advice.
          </Text>

          {/* Danger */}
          <Section>
            <Row label="Reset All Data" onPress={handleReset} destructive isLast />
          </Section>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 64, gap: 16 },
  screenTitle: { fontSize: 28, fontWeight: '200', letterSpacing: -1 },

  section: { gap: 7 },
  sectionTitle: { fontSize: 10, fontWeight: '600', letterSpacing: 1.8, marginLeft: 4 },
  sectionCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },

  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: { fontSize: 15, fontWeight: '300' },
  rowValue: { fontSize: 12 },

  editBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  editBtnText: { fontSize: 15, fontWeight: '500' },

  themeRow: { flexDirection: 'row', padding: 10, gap: 8 },
  themeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  themeBtnText: { fontSize: 13, fontWeight: '500' },

  disclaimer: { fontSize: 11, lineHeight: 18, paddingHorizontal: 4 },
});
