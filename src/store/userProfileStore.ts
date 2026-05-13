import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/user';
import { calculateLifeStats } from '../lib/timeCalculations';
import { LifeStats } from '../types/lifeStats';

const PROFILE_KEY = '@time_left_profile';
const WIDGET_DATA_KEY = '@time_left_widget_data';

export interface WidgetData {
  percentageLived: number;
  daysRemaining: number;
  yearsRemaining: number;
  dailyQuote: string;
  updatedAt: string;
}

let _profile: UserProfile | null = null;
let _listeners: Array<() => void> = [];

function notifyListeners() {
  _listeners.forEach((fn) => fn());
}

export async function loadProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    _profile = raw ? JSON.parse(raw) : null;
    notifyListeners();
    return _profile;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  _profile = { ...profile, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(_profile));
  await syncWidgetData(_profile);
  notifyListeners();
}

export async function clearProfile(): Promise<void> {
  _profile = null;
  await AsyncStorage.removeItem(PROFILE_KEY);
  await AsyncStorage.removeItem(WIDGET_DATA_KEY);
  notifyListeners();
}

async function syncWidgetData(profile: UserProfile): Promise<void> {
  try {
    const stats = calculateLifeStats(profile);
    const { getDailyQuote } = await import('../lib/quotes');
    const quote = getDailyQuote();
    const widgetData: WidgetData = {
      percentageLived: stats.percentageLived,
      daysRemaining: stats.daysRemaining,
      yearsRemaining: stats.yearsRemaining,
      dailyQuote: quote.text,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(widgetData));
  } catch {
    // non-critical
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(_profile);
  const [isLoaded, setIsLoaded] = useState(_profile !== null);

  useEffect(() => {
    const update = () => setProfile(_profile);
    _listeners.push(update);

    if (!isLoaded) {
      loadProfile().then((p) => {
        setProfile(p);
        setIsLoaded(true);
      });
    }

    return () => {
      _listeners = _listeners.filter((fn) => fn !== update);
    };
  }, [isLoaded]);

  const save = useCallback(async (p: UserProfile) => {
    await saveProfile(p);
  }, []);

  const clear = useCallback(async () => {
    await clearProfile();
  }, []);

  const stats: LifeStats | null = profile ? calculateLifeStats(profile) : null;

  return { profile, stats, isLoaded, save, clear };
}
