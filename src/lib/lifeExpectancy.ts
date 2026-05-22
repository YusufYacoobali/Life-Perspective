import { UserProfile } from '../types/user';
import { getCountryByCode } from './countryData';

export function calculateLifeExpectancy(profile: UserProfile): number {
  if (profile.overrideLifeExpectancyYears) {
    // User override is intentionally bounded to the range allowed in setup/settings.
    return Math.min(Math.max(Math.round(profile.overrideLifeExpectancyYears), 40), 150);
  }

  const country = getCountryByCode(profile.countryCode);
  // Start from the country/sex LE baseline, then apply broad lifestyle adjustments.
  // This is for reflective estimates only; it is not an actuarial or medical model.
  let base = country
    ? profile.gender === 'female'
      ? country.femaleLE
      : country.maleLE
    : 73;

  // BMI adjustment: broad population-level bands, in estimated years.
  if (profile.heightCm && profile.weightKg) {
    const bmi = profile.weightKg / Math.pow(profile.heightCm / 100, 2);
    if (bmi < 16) base -= 4;
    else if (bmi < 18.5) base -= 2;
    else if (bmi <= 24.9) base += 1;
    else if (bmi <= 29.9) base -= 1;
    else if (bmi <= 34.9) base -= 3;
    else base -= 5;
  }

  // Smoking adjustment: current smoking has a larger negative estimate than former smoking.
  if (profile.smokingStatus === 'current') base -= 8;
  else if (profile.smokingStatus === 'former') base -= 2;

  // Activity level adjustment: shifts the estimate up/down from the country baseline.
  if (profile.activityLevel === 'sedentary') base -= 3;
  else if (profile.activityLevel === 'light') base -= 1;
  else if (profile.activityLevel === 'moderate') base += 1;
  else if (profile.activityLevel === 'active') base += 3;
  else if (profile.activityLevel === 'veryActive') base += 4;

  return Math.max(Math.round(base), 40);
}
