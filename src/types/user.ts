export type Gender = 'male' | 'female';
export type SmokingStatus = 'never' | 'former' | 'current';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export interface UserProfile {
  countryCode: string;
  countryName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  heightCm: number | null;
  weightKg: number | null;
  smokingStatus: SmokingStatus;
  activityLevel: ActivityLevel;
  overrideLifeExpectancyYears?: number | null;
  createdAt: string;
  updatedAt: string;
}
