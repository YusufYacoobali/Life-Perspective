import { getCountryByCode } from './countryData';
import { LifeStats } from '../types/lifeStats';
import { UserProfile } from '../types/user';

export type PerspectiveMetricKey =
  | 'holidays'
  | 'worldCups'
  | 'olympics'
  | 'phones'
  | 'cars'
  | 'homes'
  | 'summers'
  | 'seasons'
  | 'weekends'
  | 'moons'
  | 'thousand';

export interface PerspectiveMetric {
  key: PerspectiveMetricKey;
  title: string;
  icon: string;
  value: number;
  unit: string;
  caption: string;
  marks: number;
  usedMarks: number;
  markLabel: string;
}

export interface LifeStageMetric {
  title: string;
  range: string;
  left: number;
  percentage: number;
}

export function ageYears(dateString: string) {
  const dob = new Date(dateString);
  return Math.max(0, (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

function eventsLeft(daysLeft: number, cadenceYears: number) {
  const base = Math.floor(daysLeft / (365.25 * cadenceYears));
  return Math.max(0, daysLeft > 0 ? base + 1 : base);
}

function eventMarks(days: number, cadenceYears: number) {
  return Math.max(0, Math.floor(days / (365.25 * cadenceYears)));
}

function splitMarks(used: number, left: number) {
  return {
    marks: Math.max(1, used + left),
    usedMarks: Math.max(0, used),
  };
}

export function buildPerspectiveMetrics(profile: UserProfile, stats: LifeStats): PerspectiveMetric[] {
  const daysLeft = Math.max(stats.daysRemaining, 0);
  const remainingYears = daysLeft / 365.25;
  const age = ageYears(profile.dateOfBirth);
  const adultYearsLived = Math.max(0, Math.min(age, stats.estimatedLifeExpectancyYears) - 18);
  const adultRemainingYears = Math.max(0, stats.estimatedLifeExpectancyYears - Math.max(age, 18));
  const country = getCountryByCode(profile.countryCode);
  const travelFactor = country?.travelFactor ?? 0.5;
  const carFactor = country?.carFactor ?? 0.6;
  const phoneFactor = country?.phoneFactor ?? 0.7;
  const homeFactor = country?.homeFactor ?? 0.6;
  const annualTrips = 1.1 * travelFactor;
  const phoneIntervalYears = Math.max(1.8, 3.2 / Math.max(phoneFactor, 0.3));

  const holidaysLeft = Math.round(remainingYears * annualTrips);
  const holidaysUsed = Math.round(age * annualTrips);
  const worldCupsLeft = eventsLeft(daysLeft, 4);
  const olympicsLeft = eventsLeft(daysLeft, 2);
  const phonesLeft = Math.floor(remainingYears / phoneIntervalYears);
  const phonesUsed = Math.max(0, Math.floor(Math.max(age - 13, 0) / phoneIntervalYears));
  const carsLeft = Math.max(0, Math.round((adultRemainingYears / 8) * carFactor));
  const carsUsed = Math.max(0, Math.round((adultYearsLived / 8) * carFactor));
  const homesLeft = Math.max(0, Math.round((adultRemainingYears / 13) * homeFactor));
  const homesUsed = Math.max(0, Math.round((adultYearsLived / 13) * homeFactor));

  return [
    {
      key: 'holidays',
      title: 'Holidays',
      icon: 'airplane-outline',
      value: holidaysLeft,
      unit: 'proper trips left',
      caption: `Rough ${profile.countryName} travel factor.`,
      ...splitMarks(holidaysUsed, holidaysLeft),
      markLabel: '1 mark = 1 proper trip',
    },
    {
      key: 'worldCups',
      title: 'World Cups',
      icon: 'football-outline',
      value: worldCupsLeft,
      unit: 'World Cups left',
      caption: 'One tournament roughly every four years.',
      ...splitMarks(eventMarks(stats.daysLived, 4), worldCupsLeft),
      markLabel: '1 mark = 1 World Cup',
    },
    {
      key: 'olympics',
      title: 'Olympics',
      icon: 'medal-outline',
      value: olympicsLeft,
      unit: 'Olympic Games left',
      caption: 'Summer and Winter Games as a two-year rhythm.',
      ...splitMarks(eventMarks(stats.daysLived, 2), olympicsLeft),
      markLabel: '1 mark = 1 Olympic Games',
    },
    {
      key: 'phones',
      title: 'Phones',
      icon: 'phone-portrait-outline',
      value: phonesLeft,
      unit: 'phone upgrades left',
      caption: `About every ${phoneIntervalYears.toFixed(1)} years.`,
      ...splitMarks(phonesUsed, phonesLeft),
      markLabel: '1 mark = 1 phone upgrade',
    },
    {
      key: 'cars',
      title: 'Cars',
      icon: 'car-outline',
      value: carsLeft,
      unit: 'cars you may own',
      caption: 'Country-adjusted ownership lens.',
      ...splitMarks(carsUsed, carsLeft),
      markLabel: '1 mark = 1 car chapter',
    },
    {
      key: 'homes',
      title: 'Homes',
      icon: 'home-outline',
      value: homesLeft,
      unit: 'homes you may live in',
      caption: 'Major home chapters still ahead.',
      ...splitMarks(homesUsed, homesLeft),
      markLabel: '1 mark = 1 home chapter',
    },
    {
      key: 'summers',
      title: 'Summers',
      icon: 'partly-sunny-outline',
      value: Math.max(0, Math.ceil(daysLeft / 365.25)),
      unit: 'summers left',
      caption: 'Each one a full season to make count.',
      marks: Math.max(1, Math.ceil(stats.totalDaysEstimated / 365.25)),
      usedMarks: Math.max(0, Math.floor(stats.daysLived / 365.25)),
      markLabel: '1 mark = 1 summer',
    },
    {
      key: 'seasons',
      title: 'Seasons',
      icon: 'leaf-outline',
      value: Math.floor(daysLeft / 91.31),
      unit: 'seasons left',
      caption: 'Four turns of the year.',
      marks: Math.max(1, Math.floor(stats.totalDaysEstimated / 91.31)),
      usedMarks: Math.max(0, Math.floor(stats.daysLived / 91.31)),
      markLabel: '1 mark = 1 season',
    },
    {
      key: 'weekends',
      title: 'Weekends',
      icon: 'sunny-outline',
      value: Math.floor(daysLeft / 7),
      unit: 'weekends left',
      caption: 'The ordinary treasure.',
      marks: Math.max(1, Math.floor(stats.totalDaysEstimated / 7)),
      usedMarks: Math.max(0, Math.floor(stats.daysLived / 7)),
      markLabel: '1 mark = 1 weekend',
    },
    {
      key: 'moons',
      title: 'Full Moons',
      icon: 'moon-outline',
      value: Math.floor(daysLeft / 29.53),
      unit: 'full moons left',
      caption: 'A slower rhythm for the same time.',
      marks: Math.max(1, Math.floor(stats.totalDaysEstimated / 29.53)),
      usedMarks: Math.max(0, Math.floor(stats.daysLived / 29.53)),
      markLabel: '1 mark = 1 full moon',
    },
    {
      key: 'thousand',
      title: '1,000 Days',
      icon: 'grid-outline',
      value: Math.ceil(daysLeft / 1000),
      unit: 'blocks left',
      caption: 'Most lives only contain a few dozen.',
      marks: Math.max(1, Math.ceil(stats.totalDaysEstimated / 1000)),
      usedMarks: Math.max(0, Math.floor(stats.daysLived / 1000)),
      markLabel: '1 mark = 1,000 days',
    },
  ];
}

export function buildLifeStages(profile: UserProfile, stats: LifeStats): LifeStageMetric[] {
  const age = ageYears(profile.dateOfBirth);
  const expected = stats.estimatedLifeExpectancyYears;
  const stages = [
    { title: 'Childhood', start: 0, end: 13 },
    { title: 'Teenage years', start: 13, end: 20 },
    { title: 'Adulthood', start: 20, end: 65 },
    { title: 'Later life', start: 65, end: expected },
  ];

  return stages
    .filter((stage) => stage.end > stage.start)
    .map((stage) => {
      const length = Math.max(stage.end - stage.start, 1);
      const used = Math.min(Math.max(age - stage.start, 0), length);
      const left = Math.max(stage.end - Math.max(age, stage.start), 0);
      return {
        title: stage.title,
        range: `${Math.round(stage.start)}-${Math.round(stage.end)}`,
        left,
        percentage: Math.min(Math.max((used / length) * 100, 0), 100),
      };
    });
}

export function getPerspectiveMetric(
  key: string | undefined,
  profile: UserProfile,
  stats: LifeStats,
): PerspectiveMetric | null {
  return buildPerspectiveMetrics(profile, stats).find((metric) => metric.key === key) ?? null;
}
