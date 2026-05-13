import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@time_left_settings';

interface AppSettings {
  hapticsEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  hapticsEnabled: true,
};

let _settings: AppSettings = { ...DEFAULT_SETTINGS };
let _loaded = false;
let _listeners: Array<() => void> = [];

function notify() {
  _listeners.forEach((fn) => fn());
}

async function load(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    _settings = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    _settings = DEFAULT_SETTINGS;
  }
  _loaded = true;
  notify();
  return _settings;
}

async function save(patch: Partial<AppSettings>): Promise<void> {
  _settings = { ..._settings, ...patch };
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(_settings));
  notify();
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(_settings);

  useEffect(() => {
    const update = () => setSettings({ ..._settings });
    _listeners.push(update);
    if (!_loaded) load().then(() => setSettings({ ..._settings }));
    return () => { _listeners = _listeners.filter((fn) => fn !== update); };
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => save({ hapticsEnabled: enabled }), []);

  return { settings, setHapticsEnabled };
}

export function getHapticsEnabled(): boolean {
  return _settings.hapticsEnabled;
}

// Ensure settings are loaded at module import time
load();
