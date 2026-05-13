import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';
import { AppButton } from '../src/components/AppButton';
import { AppInput } from '../src/components/AppInput';
import { saveProfile } from '../src/store/userProfileStore';
import { COUNTRIES } from '../src/lib/countryData';
import { Gender, SmokingStatus, ActivityLevel, UserProfile } from '../src/types/user';
import { isReasonableAge, isValidHeight, isValidWeight, ftToCm, lbsToKg } from '../src/lib/validation';

const { width } = Dimensions.get('window');
const TOTAL_STEPS = 9;

interface OnboardingData {
  countryCode: string;
  countryName: string;
  dateOfBirth: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: Gender | '';
  heightCm: string;
  weightKg: string;
  heightFt: string;
  heightIn: string;
  weightLbs: string;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
  smokingStatus: SmokingStatus | '';
  activityLevel: ActivityLevel | '';
}

const INITIAL_DATA: OnboardingData = {
  countryCode: '',
  countryName: '',
  dateOfBirth: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  gender: '',
  heightCm: '',
  weightKg: '',
  heightFt: '',
  heightIn: '',
  weightLbs: '',
  heightUnit: 'cm',
  weightUnit: 'kg',
  smokingStatus: '',
  activityLevel: '',
};

function ProgressDots({ current, total, color, trackColor }: { current: number; total: number; color: string; trackColor: string }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i < current ? color : trackColor },
            i === current - 1 && { width: 20 },
          ]}
        />
      ))}
    </View>
  );
}

function ChipButton({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: selected ? '#fff' : colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [error, setError] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const update = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setError('');
  };

  const animateStep = (next: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setStep(next);
    setError('');
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) animateStep(step + 1);
    else handleComplete();
  };

  const goBack = () => {
    if (step > 1) animateStep(step - 1);
  };

  const validateStep = (): boolean => {
    if (step === 2 && !data.countryCode) {
      setError('Please select your country.');
      return false;
    }
    if (step === 3) {
      const day = parseInt(data.dobDay);
      const month = parseInt(data.dobMonth);
      const year = parseInt(data.dobYear);
      if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        setError('Please enter a valid date of birth.');
        return false;
      }
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const ageCheck = isReasonableAge(dateStr);
      if (!ageCheck.valid) { setError(ageCheck.message!); return false; }
      update({ dateOfBirth: dateStr });
    }
    if (step === 4 && !data.gender) {
      setError('Please select your biological sex.');
      return false;
    }
    if (step === 5) {
      const cm = data.heightUnit === 'cm'
        ? parseFloat(data.heightCm)
        : ftToCm(parseFloat(data.heightFt) || 0, parseFloat(data.heightIn) || 0);
      if (data.heightCm || data.heightFt) {
        if (!isValidHeight(cm)) { setError('Please enter a valid height.'); return false; }
        update({ heightCm: String(cm) });
      }
    }
    if (step === 6) {
      const kg = data.weightUnit === 'kg'
        ? parseFloat(data.weightKg)
        : lbsToKg(parseFloat(data.weightLbs));
      if (data.weightKg || data.weightLbs) {
        if (!isValidWeight(kg)) { setError('Please enter a valid weight.'); return false; }
        update({ weightKg: String(kg) });
      }
    }
    if (step === 7 && !data.smokingStatus) {
      setError('Please select an option.');
      return false;
    }
    if (step === 8 && !data.activityLevel) {
      setError('Please select your activity level.');
      return false;
    }
    return true;
  };

  const handleComplete = async () => {
    const profile: UserProfile = {
      countryCode: data.countryCode,
      countryName: data.countryName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as Gender,
      heightCm: data.heightCm ? parseFloat(data.heightCm) : null,
      weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
      smokingStatus: data.smokingStatus as SmokingStatus,
      activityLevel: data.activityLevel as ActivityLevel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveProfile(profile);
    router.replace('/(tabs)');
  };

  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : COUNTRIES;

  const s = styles;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={s.header}>
          {step > 1 ? (
            <TouchableOpacity onPress={goBack} style={s.backBtn}>
              <Text style={[s.backText, { color: colors.textSecondary }]}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <ProgressDots current={step} total={TOTAL_STEPS} color={colors.accent} trackColor={colors.border} />
          <View style={{ width: 40 }} />
        </View>

        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <ScrollView
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* STEP 1: Welcome */}
            {step === 1 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>
                  Your time is{'\n'}precious.
                </Text>
                <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>
                  Answer a few quick questions and we'll show you how much time you may have left.
                </Text>
                <Text style={[s.disclaimer, { color: colors.textTertiary, borderColor: colors.border }]}>
                  This app provides an estimate based on statistical and lifestyle factors. It is not medical advice.
                </Text>
              </View>
            )}

            {/* STEP 2: Country */}
            {step === 2 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>Where are{'\n'}you from?</Text>
                <AppInput
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChangeText={setCountrySearch}
                  autoCapitalize="words"
                  style={{ marginBottom: 8 }}
                />
                <View style={[s.countryList, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {filteredCountries.map((c) => (
                      <TouchableOpacity
                        key={c.code}
                        onPress={() => update({ countryCode: c.code, countryName: c.name })}
                        style={[
                          s.countryItem,
                          { borderBottomColor: colors.border },
                          data.countryCode === c.code && { backgroundColor: colors.accentSoft },
                        ]}
                      >
                        <Text style={[s.countryText, { color: colors.text }]}>{c.name}</Text>
                        {data.countryCode === c.code && (
                          <Text style={{ color: colors.accent }}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            {/* STEP 3: Date of Birth */}
            {step === 3 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>When were{'\n'}you born?</Text>
                <View style={s.dobRow}>
                  <AppInput
                    label="Day"
                    value={data.dobDay}
                    onChangeText={(v) => update({ dobDay: v })}
                    placeholder="DD"
                    keyboardType="number-pad"
                    maxLength={2}
                    style={{ flex: 1 }}
                    autoCapitalize="none"
                  />
                  <AppInput
                    label="Month"
                    value={data.dobMonth}
                    onChangeText={(v) => update({ dobMonth: v })}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                    style={{ flex: 1 }}
                    autoCapitalize="none"
                  />
                  <AppInput
                    label="Year"
                    value={data.dobYear}
                    onChangeText={(v) => update({ dobYear: v })}
                    placeholder="YYYY"
                    keyboardType="number-pad"
                    maxLength={4}
                    style={{ flex: 2 }}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            {/* STEP 4: Gender */}
            {step === 4 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>Your biological{'\n'}sex</Text>
                <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>
                  Used only for life expectancy calculations.
                </Text>
                <View style={s.chipRow}>
                  <ChipButton label="Male" selected={data.gender === 'male'} onPress={() => update({ gender: 'male' })} colors={colors} />
                  <ChipButton label="Female" selected={data.gender === 'female'} onPress={() => update({ gender: 'female' })} colors={colors} />
                </View>
              </View>
            )}

            {/* STEP 5: Height */}
            {step === 5 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>How tall{'\n'}are you?</Text>
                <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>Optional — helps with BMI calculation.</Text>
                <View style={s.unitToggle}>
                  <ChipButton label="cm" selected={data.heightUnit === 'cm'} onPress={() => update({ heightUnit: 'cm' })} colors={colors} />
                  <ChipButton label="ft / in" selected={data.heightUnit === 'ft'} onPress={() => update({ heightUnit: 'ft' })} colors={colors} />
                </View>
                {data.heightUnit === 'cm' ? (
                  <AppInput
                    label="Height (cm)"
                    value={data.heightCm}
                    onChangeText={(v) => update({ heightCm: v })}
                    placeholder="e.g. 175"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                  />
                ) : (
                  <View style={s.dobRow}>
                    <AppInput
                      label="Feet"
                      value={data.heightFt}
                      onChangeText={(v) => update({ heightFt: v })}
                      placeholder="5"
                      keyboardType="number-pad"
                      maxLength={1}
                      style={{ flex: 1 }}
                      autoCapitalize="none"
                    />
                    <AppInput
                      label="Inches"
                      value={data.heightIn}
                      onChangeText={(v) => update({ heightIn: v })}
                      placeholder="10"
                      keyboardType="number-pad"
                      maxLength={2}
                      style={{ flex: 1 }}
                      autoCapitalize="none"
                    />
                  </View>
                )}
              </View>
            )}

            {/* STEP 6: Weight */}
            {step === 6 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>How much{'\n'}do you weigh?</Text>
                <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>Optional.</Text>
                <View style={s.unitToggle}>
                  <ChipButton label="kg" selected={data.weightUnit === 'kg'} onPress={() => update({ weightUnit: 'kg' })} colors={colors} />
                  <ChipButton label="lbs" selected={data.weightUnit === 'lbs'} onPress={() => update({ weightUnit: 'lbs' })} colors={colors} />
                </View>
                {data.weightUnit === 'kg' ? (
                  <AppInput
                    label="Weight (kg)"
                    value={data.weightKg}
                    onChangeText={(v) => update({ weightKg: v })}
                    placeholder="e.g. 75"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                  />
                ) : (
                  <AppInput
                    label="Weight (lbs)"
                    value={data.weightLbs}
                    onChangeText={(v) => update({ weightLbs: v })}
                    placeholder="e.g. 165"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                  />
                )}
              </View>
            )}

            {/* STEP 7: Smoking */}
            {step === 7 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>Do you{'\n'}smoke?</Text>
                <View style={s.chipColumn}>
                  {([['never', 'Never smoked'], ['former', 'Former smoker'], ['current', 'Current smoker']] as [SmokingStatus, string][]).map(([val, label]) => (
                    <ChipButton key={val} label={label} selected={data.smokingStatus === val} onPress={() => update({ smokingStatus: val })} colors={colors} />
                  ))}
                </View>
              </View>
            )}

            {/* STEP 8: Activity */}
            {step === 8 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>How active{'\n'}are you?</Text>
                <View style={s.chipColumn}>
                  {(
                    [
                      ['sedentary', 'Sedentary', 'Little or no exercise'],
                      ['light', 'Lightly active', 'Exercise 1–3 days/week'],
                      ['moderate', 'Moderately active', 'Exercise 3–5 days/week'],
                      ['active', 'Very active', 'Exercise 6–7 days/week'],
                      ['veryActive', 'Extremely active', 'Hard exercise daily'],
                    ] as [ActivityLevel, string, string][]
                  ).map(([val, label, desc]) => (
                    <TouchableOpacity
                      key={val}
                      onPress={() => update({ activityLevel: val })}
                      activeOpacity={0.75}
                      style={[
                        s.activityItem,
                        {
                          backgroundColor: data.activityLevel === val ? colors.accentSoft : colors.surface,
                          borderColor: data.activityLevel === val ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[s.activityLabel, { color: colors.text }]}>{label}</Text>
                        <Text style={[s.activityDesc, { color: colors.textSecondary }]}>{desc}</Text>
                      </View>
                      {data.activityLevel === val && (
                        <Text style={{ color: colors.accent }}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* STEP 9: Done */}
            {step === 9 && (
              <View style={s.stepContainer}>
                <Text style={[s.stepTitle, { color: colors.text }]}>You're{'\n'}all set.</Text>
                <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>
                  We've estimated your lifespan based on your profile. This is for reflection only — make it count.
                </Text>
                <Text style={[s.disclaimer, { color: colors.textTertiary, borderColor: colors.border }]}>
                  This app provides an approximate life expectancy estimate based on broad statistical and lifestyle factors. It is intended for reflection only and is not medical, health or financial advice.
                </Text>
              </View>
            )}

            {error ? (
              <Text style={[s.errorText, { color: colors.destructive }]}>{error}</Text>
            ) : null}
          </ScrollView>
        </Animated.View>

        <View style={[s.footer, { borderTopColor: colors.border }]}>
          <AppButton
            label={step === TOTAL_STEPS ? 'See Your Time Left' : step === 1 ? 'Get Started' : 'Continue'}
            onPress={goNext}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 22 },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 },
  stepContainer: { gap: 20 },
  stepTitle: {
    fontSize: 40,
    fontWeight: '200',
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  stepSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  chipRow: { flexDirection: 'row', gap: 12 },
  chipColumn: { gap: 10 },
  unitToggle: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
  },
  chipText: { fontSize: 15, fontWeight: '500' },
  dobRow: { flexDirection: 'row', gap: 8 },
  countryList: {
    borderWidth: 1,
    borderRadius: 12,
    height: 280,
    overflow: 'hidden',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  countryText: { fontSize: 15 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  activityLabel: { fontSize: 15, fontWeight: '500' },
  activityDesc: { fontSize: 12, marginTop: 2 },
  errorText: { fontSize: 13, textAlign: 'center', marginTop: 8 },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
