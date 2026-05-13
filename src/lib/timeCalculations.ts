import { UserProfile } from '../types/user';
import { LifeStats } from '../types/lifeStats';
import { calculateLifeExpectancy } from './lifeExpectancy';

export function calculateLifeStats(profile: UserProfile): LifeStats {
  const now = new Date();
  const dob = new Date(profile.dateOfBirth);
  const lifeExpectancyYears = calculateLifeExpectancy(profile);

  const estimatedDeathDate = new Date(dob);
  estimatedDeathDate.setFullYear(dob.getFullYear() + lifeExpectancyYears);

  const msLived = now.getTime() - dob.getTime();
  const msRemaining = Math.max(estimatedDeathDate.getTime() - now.getTime(), 0);
  const msTotal = estimatedDeathDate.getTime() - dob.getTime();

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

  const daysLived = msLived / msPerDay;
  const daysRemaining = msRemaining / msPerDay;

  return {
    estimatedLifeExpectancyYears: lifeExpectancyYears,
    estimatedDeathDate: estimatedDeathDate.toISOString(),
    yearsLived: Math.floor(daysLived / daysPerYear),
    yearsRemaining: Math.floor(daysRemaining / daysPerYear),
    percentageLived: Math.round(percentageLived * 10) / 10,
    percentageRemaining: Math.round(percentageRemaining * 10) / 10,
    monthsLived: Math.floor(daysLived / daysPerMonth),
    monthsRemaining: Math.floor(daysRemaining / daysPerMonth),
    weeksLived: Math.floor(daysLived / daysPerWeek),
    weeksRemaining: Math.floor(daysRemaining / daysPerWeek),
    daysLived: Math.floor(daysLived),
    daysRemaining: Math.floor(daysRemaining),
    hoursRemaining: Math.floor(msRemaining / msPerHour),
    minutesRemaining: Math.floor(msRemaining / msPerMinute),
  };
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}
