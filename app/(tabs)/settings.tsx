import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { useTheme, ThemeMode } from '../../src/theme';
import { useUserProfile } from '../../src/store/userProfileStore';
import { useAppSettings } from '../../src/store/settingsStore';
import { hapticLight } from '../../src/lib/haptics';
import { LIFE_EXPECTANCY_DISCLAIMER, LIFE_EXPECTANCY_SOURCES } from '../../src/lib/countryData';

function Row({
  icon,
  label,
  value,
  onPress,
  destructive,
  isLast,
}: {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
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
      activeOpacity={onPress ? 0.6 : 1}
      style={[
        styles.row,
        !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={styles.rowLeft}>
        {icon ? (
          <Ionicons name={icon} size={17} color={destructive ? colors.destructive : colors.textTertiary} />
        ) : null}
        <Text style={[styles.rowLabel, { color: destructive ? colors.destructive : colors.text }]}>
          {label}
        </Text>
      </View>
      {value != null ? <Text style={[styles.rowValue, { color: colors.textTertiary }]}>{value}</Text> : null}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.section}>
      {title ? <Text style={[styles.sectionTitle, { color: colors.accentWarm }]}>{title}</Text> : null}
      <View
        style={[
          styles.sectionPanel,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.68)',
            borderColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(17,17,20,0.09)',
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function CitationLink({
  name,
  url,
  isLast,
}: {
  name: string;
  url: string;
  isLast?: boolean;
}) {
  const { colors } = useTheme();

  const openSource = async () => {
    hapticLight();
    await Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      onPress={openSource}
      activeOpacity={0.65}
      style={[
        styles.citationRow,
        !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={styles.citationTextWrap}>
        <Text style={[styles.citationName, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.citationUrl, { color: colors.textTertiary }]} numberOfLines={1}>
          {url}
        </Text>
      </View>
      <Ionicons name="open-outline" size={16} color={colors.accentWarm} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { colors, isDark, mode, setMode } = useTheme();
  const { profile, stats, clear, refreshWidgets } = useUserProfile();
  const { settings, setHapticsEnabled } = useAppSettings();

  const gradientColors: [string, string, string] = isDark
    ? ['#07080A', '#101216', '#07080A']
    : ['#F7F3EA', '#F1EFE8', '#F7F3EA'];

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete your profile and local settings.',
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

  const handleReview = async () => {
    hapticLight();
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    } else {
      Alert.alert('Review', 'Store review is not available on this device.');
    }
  };

  const handleRefreshWidgets = async () => {
    hapticLight();
    await refreshWidgets();
    Alert.alert('Widgets refreshed', 'Your latest profile estimate has been pushed to the widgets.');
  };

  const themeOptions: { label: string; value: ThemeMode; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
    { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
    { label: 'Light', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark', value: 'dark', icon: 'moon-outline' },
  ];

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.kicker, { color: colors.accentWarm }]}>CONTROL ROOM</Text>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          </View>

          {profile && stats ? (
            <Section title="PROFILE">
              <Row icon="earth-outline" label={profile.countryName} value="Country" />
              <Row
                icon="calendar-outline"
                label={new Date(profile.dateOfBirth).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                value="Birth date"
              />
              <Row icon="person-outline" label={profile.gender === 'male' ? 'Male' : 'Female'} value="Sex" />
              <Row icon="hourglass-outline" label={`~${stats.estimatedLifeExpectancyYears} years`} value="Estimate" isLast />
            </Section>
          ) : null}

          {profile ? (
            <TouchableOpacity
              onPress={() => router.push('/onboarding')}
              style={[styles.editButton, { borderColor: colors.accentWarm, backgroundColor: colors.accentSoft }]}
            >
              <Ionicons name="create-outline" size={17} color={colors.accentWarm} />
              <Text style={[styles.editText, { color: colors.accentWarm }]}>Edit profile inputs</Text>
            </TouchableOpacity>
          ) : null}

          <Section title="APPEARANCE">
            <View style={styles.themeRow}>
              {themeOptions.map((opt) => {
                const active = mode === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setMode(opt.value)}
                    style={[
                      styles.themeButton,
                      {
                        backgroundColor: active ? colors.accentWarm : 'transparent',
                        borderColor: active ? colors.accentWarm : colors.border,
                      },
                    ]}
                  >
                    <Ionicons name={opt.icon} size={16} color={active ? '#fff' : colors.textSecondary} />
                    <Text style={[styles.themeText, { color: active ? '#fff' : colors.textSecondary }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          <Section title="PREFERENCES">
            <View
              style={[
                styles.row,
                { borderBottomColor: colors.border },
              ]}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="phone-portrait-outline" size={17} color={colors.textTertiary} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Haptic feedback</Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(val) => {
                  hapticLight();
                  setHapticsEnabled(val);
                }}
                trackColor={{ false: colors.border, true: colors.accentWarm }}
                thumbColor="#fff"
              />
            </View>
          </Section>

          <Section title="WIDGETS">
            {Platform.OS === 'ios' ? (
              <Row icon="logo-apple" label="Home Screen widgets" value="WidgetKit" />
            ) : (
              <Row icon="phone-portrait-outline" label="Home screen widgets" value="Enabled" />
            )}
            <Row icon="refresh-outline" label="Refresh widgets now" onPress={handleRefreshWidgets} isLast />
            <View style={[styles.helperBox, { borderTopColor: colors.border }]}>
              <Text style={[styles.helperText, { color: colors.textTertiary }]}>
                Life Dots compresses your estimated lifetime into a small grid. Filled dots are lived time,
                the ring is your current block, and dim dots are the weeks still ahead.
              </Text>
            </View>
          </Section>

          <Section title="SOURCES & SAFETY">
            <View style={[styles.sourceIntro, { borderBottomColor: colors.border }]}>
              <Ionicons name="shield-checkmark-outline" size={17} color={colors.accentWarm} />
              <Text style={[styles.sourceIntroText, { color: colors.textTertiary }]}>
                {LIFE_EXPECTANCY_DISCLAIMER}
              </Text>
            </View>
            {LIFE_EXPECTANCY_SOURCES.map((source, index) => (
              <CitationLink
                key={source.url}
                name={source.name}
                url={source.url}
                isLast={index === LIFE_EXPECTANCY_SOURCES.length - 1}
              />
            ))}
          </Section>

          <Section title="ABOUT">
            <Row icon="sparkles-outline" label="Life Perspective" value="v1.0.0" />
            <Row icon="star-outline" label="Rate & Review" onPress={handleReview} isLast />
          </Section>

          <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
            This app provides an approximate life expectancy estimate based on broad statistical and lifestyle factors.
            It is intended for reflection only and is not medical, health or financial advice.
          </Text>

          <Section>
            <Row icon="trash-outline" label="Reset All Data" onPress={handleReset} destructive isLast />
          </Section>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 88, gap: 16 },
  header: { gap: 7 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 2.4 },
  title: { fontSize: 38, lineHeight: 44, fontWeight: '200' },
  section: { gap: 8 },
  sectionTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  sectionPanel: { borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  row: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '400' },
  rowValue: { fontSize: 12, textAlign: 'right' },
  helperBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  helperText: { fontSize: 12, lineHeight: 17 },
  sourceIntro: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  sourceIntroText: { flex: 1, fontSize: 12, lineHeight: 17 },
  citationRow: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  citationTextWrap: { flex: 1, gap: 3 },
  citationName: { fontSize: 14, fontWeight: '600', lineHeight: 19 },
  citationUrl: { fontSize: 11 },
  editButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  editText: { fontSize: 14, fontWeight: '800' },
  themeRow: { flexDirection: 'row', padding: 10, gap: 8 },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    gap: 5,
  },
  themeText: { fontSize: 12, fontWeight: '700' },
  disclaimer: { fontSize: 12, lineHeight: 18, paddingHorizontal: 4 },
});
