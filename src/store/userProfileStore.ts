import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/user';
import { calculateLifeStats } from '../lib/timeCalculations';
import { LifeStats } from '../types/lifeStats';
import { clearIOSWidgetData, writeIOSWidgetData } from '../native/iosWidgetBridge';
import { refreshAndroidWidgets } from '../widgets/refreshAndroidWidgets';
import { buildWidgetData, DEFAULT_WIDGET_DATA, WidgetData } from '../widgets/widgetData';

const PROFILE_KEY = '@time_left_profile';
const WIDGET_DATA_KEY = '@time_left_widget_data';

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
    if (_profile) await _syncIfNewDay(_profile);
    return _profile;
  } catch {
    return null;
  }
}

async function _syncIfNewDay(profile: UserProfile): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    if (!raw) { await syncWidgetData(profile); return; }
    const stored = JSON.parse(raw) as WidgetData;
    const lastDate = new Date(stored.updatedAt).toDateString();
    const today = new Date().toDateString();
    if (lastDate !== today) await syncWidgetData(profile);
  } catch {
    // non-critical
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  _profile = { ...profile, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(_profile));
  await refreshWidgetData(_profile);
  notifyListeners();
}

export async function clearProfile(): Promise<void> {
  _profile = null;
  await AsyncStorage.removeItem(PROFILE_KEY);
  await AsyncStorage.removeItem(WIDGET_DATA_KEY);
  await clearIOSWidgetData();
  await refreshAndroidWidgets(DEFAULT_WIDGET_DATA);
  notifyListeners();
}

export async function refreshWidgetData(profile = _profile): Promise<void> {
  if (!profile) return;

  try {
    const stats = calculateLifeStats(profile);
    const { getDailyQuote } = await import('../lib/quotes');
    const quote = getDailyQuote();
    const widgetData = buildWidgetData(profile, stats, quote.text);
    await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(widgetData));
    await writeIOSWidgetData(widgetData);
    await refreshAndroidWidgets(widgetData);
  } catch {
    // non-critical
  }
}

async function syncWidgetData(profile: UserProfile): Promise<void> {
  await refreshWidgetData(profile);
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(_profile);
  const [isLoaded, setIsLoaded] = useState(_profile !== null);
  const [, setClockTick] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTick((tick) => tick + 1);
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const save = useCallback(async (p: UserProfile) => {
    await saveProfile(p);
  }, []);

  const refreshWidgets = useCallback(async () => {
    await refreshWidgetData(_profile);
  }, []);

  const clear = useCallback(async () => {
    await clearProfile();
  }, []);

  const stats: LifeStats | null = profile ? calculateLifeStats(profile) : null;

  return { profile, stats, isLoaded, save, clear, refreshWidgets };
}
