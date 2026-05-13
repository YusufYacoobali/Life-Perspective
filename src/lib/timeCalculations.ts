import { UserProfile } from '../types/user';
import { LifeStats } from '../types/lifeStats';
import { calculateLifeExpectancy } from './lifeExpectancy';

export function calculateLifeStats(profile: UserProfile): LifeStats {
  const now = new Date();
  const dob = new Date(profile.dateOfBirth);
  const lifeExpectancyYears = calculateLifeExpectancy(profile);

  const estimatedDeathDate = new Date(dob);
  estimatedDeathDate.setFullYear(dob.getFullYear() + lifeExpectancyYears);

  const msLived = Math.max(now.getTime() - dob.getTime(), 0);
  const msRemaining = Math.max(estimatedDeathDate.getTime() - now.getTime(), 0);
  const msTotal = Math.max(estimatedDeathDate.getTime() - dob.getTime(), 1);

  const percentageLived = Math.min((msLived / msTotal) * 100, 100);
  const percentageRemaining = Math.max(100 - percentageLived, 0);

  const secondsPerMinute = 60;
  const minutesPerHour = 60;
  const hoursPerDay = 24;
  const daysPerWeek = 7;
  const daysPerMonth = 30.44;
  const daysPerYear = 365.25;

  const msPerDay = secondsPerMinute * minutesPerHour * hoursPerDay * 1000;
  const msPerHour = secondsPerMinute * minutesPerHour * 1000;
  const msPerMinute = secondsPerMinute * 1000;

  const totalDaysEstimated = Math.max(Math.ceil(msTotal / msPerDay), 1);
  const daysLived = Math.min(Math.floor(msLived / msPerDay), totalDaysEstimated);
  const daysRemaining = Math.max(totalDaysEstimated - daysLived, 0);
  const preciseDaysLived = msLived / msPerDay;
  const preciseDaysRemaining = msRemaining / msPerDay;

  return {
    estimatedLifeExpectancyYears: lifeExpectancyYears,
    estimatedDeathDate: estimatedDeathDate.toISOString(),
    yearsLived: Math.floor(preciseDaysLived / daysPerYear),
    yearsRemaining: Math.floor(preciseDaysRemaining / daysPerYear),
    percentageLived: Math.round(percentageLived * 10) / 10,
    percentageRemaining: Math.round(percentageRemaining * 10) / 10,
    monthsLived: Math.floor(preciseDaysLived / daysPerMonth),
    monthsRemaining: Math.floor(preciseDaysRemaining / daysPerMonth),
    weeksLived: Math.floor(preciseDaysLived / daysPerWeek),
    weeksRemaining: Math.floor(preciseDaysRemaining / daysPerWeek),
    totalDaysEstimated,
    daysLived,
    daysRemaining,
    hoursRemaining: Math.floor(msRemaining / msPerHour),
    minutesRemaining: Math.floor(msRemaining / msPerMinute),
  };
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}
