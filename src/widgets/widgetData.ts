import { LifeStats } from '../types/lifeStats';
import { UserProfile } from '../types/user';

export interface WidgetMilestone {
  title: string;
  subtitle: string;
  days: number;
  tone: 'pink' | 'blue' | 'green' | 'amber';
}

export interface WidgetData {
  percentageLived: number;
  percentageRemaining: number;
  daysRemaining: number;
  yearsRemaining: number;
  weeksLived: number;
  weeksRemaining: number;
  totalWeeksEstimated: number;
  monthsLived: number;
  monthsRemaining: number;
  todayMinutesRemaining: number;
  todayElapsedPercentage: number;
  todayTimeLeftLabel: string;
  dailyQuote: string;
  milestones: WidgetMilestone[];
  updatedAt: string;
}

// Placeholder data used by native widgets before the app has written real profile stats.
export const DEFAULT_WIDGET_DATA: WidgetData = {
  percentageLived: 31,
  percentageRemaining: 69,
  daysRemaining: 18998,
  yearsRemaining: 52,
  weeksLived: 2384,
  weeksRemaining: 1776,
  totalWeeksEstimated: 4160,
  monthsLived: 548,
  monthsRemaining: 624,
  todayMinutesRemaining: 462,
  todayElapsedPercentage: 67.9,
  todayTimeLeftLabel: '7h 42m',
  dailyQuote: 'Do not waste what you cannot get back.',
  milestones: [
    { title: 'Next Birthday', subtitle: '47 days', days: 47, tone: 'pink' },
    { title: 'Age 30', subtitle: '842 days', days: 842, tone: 'blue' },
    { title: 'Retirement', subtitle: '5,764 days', days: 5764, tone: 'amber' },
  ],
  updatedAt: new Date(0).toISOString(),
};

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysUntil(date: Date, now = new Date()) {
  // Compare calendar days, not exact hours, so milestone widgets read naturally.
  return Math.max(0, Math.ceil((startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS));
}

function ageYears(dateString: string, now = new Date()) {
  const dob = new Date(dateString);
  return Math.max(0, (now.getTime() - dob.getTime()) / (365.25 * DAY_MS));
}

function nextBirthday(dateString: string, now = new Date()) {
  const dob = new Date(dateString);
  let next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (startOfDay(next).getTime() < startOfDay(now).getTime()) {
    next = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  return next;
}

function nextRoundAge(dateString: string, now = new Date()) {
  const dob = new Date(dateString);
  const age = ageYears(dateString, now);
  const targets = [18, 21, 25, 30, 40, 50, 60, 65, 70, 80, 90, 100, 110];
  const target = targets.find((value) => value > age) ?? Math.ceil(age / 10) * 10 + 10;
  return {
    target,
    date: new Date(dob.getFullYear() + target, dob.getMonth(), dob.getDate()),
  };
}

function compactDays(days: number) {
  return `${days.toLocaleString()} day${days === 1 ? '' : 's'}`;
}

export function getTodayCountdown(now = new Date()) {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const minutesRemaining = Math.max(0, Math.ceil((midnight.getTime() - now.getTime()) / (60 * 1000)));
  const elapsedMinutes = 24 * 60 - minutesRemaining;
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = minutesRemaining % 60;

  return {
    minutesRemaining,
    // Native widgets use this to draw the day progress bar/ring.
    elapsedPercentage: Math.min(Math.max((elapsedMinutes / (24 * 60)) * 100, 0), 100),
    label: `${hours}h ${minutes.toString().padStart(2, '0')}m`,
  };
}

export function buildMilestones(profile: UserProfile, now = new Date()): WidgetMilestone[] {
  const birthday = nextBirthday(profile.dateOfBirth, now);
  const roundAge = nextRoundAge(profile.dateOfBirth, now);
  const retirementAge = 67;
  const dob = new Date(profile.dateOfBirth);
  const retirementDate = new Date(dob.getFullYear() + retirementAge, dob.getMonth(), dob.getDate());
  const newYear = new Date(now.getFullYear() + 1, 0, 1);

  const milestones: WidgetMilestone[] = [
    {
      title: 'Next Birthday',
      subtitle: `${Math.ceil(daysUntil(birthday, now) / 7).toLocaleString()} Sundays`,
      days: daysUntil(birthday, now),
      tone: 'pink',
    },
    {
      title: `Age ${roundAge.target}`,
      subtitle: compactDays(daysUntil(roundAge.date, now)),
      days: daysUntil(roundAge.date, now),
      tone: 'blue',
    },
    {
      title: 'Retirement',
      subtitle: retirementDate > now ? compactDays(daysUntil(retirementDate, now)) : 'already passed',
      days: retirementDate > now ? daysUntil(retirementDate, now) : 0,
      tone: 'amber',
    },
    {
      title: 'New Year',
      subtitle: compactDays(daysUntil(newYear, now)),
      days: daysUntil(newYear, now),
      tone: 'green',
    },
  ];

  return milestones
    .filter((milestone) => milestone.days >= 0)
    // Keep only the nearest milestones so the compact widget stays readable.
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);
}

export function buildWidgetData(profile: UserProfile, stats: LifeStats, dailyQuote: string): WidgetData {
  const today = getTodayCountdown();
  return {
    percentageLived: stats.percentageLived,
    percentageRemaining: stats.percentageRemaining,
    daysRemaining: stats.daysRemaining,
    yearsRemaining: stats.yearsRemaining,
    weeksLived: stats.weeksLived,
    weeksRemaining: stats.weeksRemaining,
    totalWeeksEstimated: Math.max(stats.weeksLived + stats.weeksRemaining, 1),
    monthsLived: stats.monthsLived,
    monthsRemaining: stats.monthsRemaining,
    todayMinutesRemaining: today.minutesRemaining,
    todayElapsedPercentage: today.elapsedPercentage,
    todayTimeLeftLabel: today.label,
    dailyQuote,
    milestones: buildMilestones(profile),
    updatedAt: new Date().toISOString(),
  };
}
