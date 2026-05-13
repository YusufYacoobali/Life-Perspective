import { Platform } from 'react-native';
import { requireNativeModule } from 'expo-modules-core';

export interface IOSWidgetPayload {
  percentageLived: number;
  daysRemaining: number;
  yearsRemaining: number;
  dailyQuote: string;
}

interface TimeLeftWidgetBridgeModule {
  setWidgetData(json: string): Promise<boolean>;
  clearWidgetData(): Promise<boolean>;
}

let cachedBridge: TimeLeftWidgetBridgeModule | null | undefined;

function getBridge(): TimeLeftWidgetBridgeModule | null {
  if (Platform.OS !== 'ios') return null;
  if (cachedBridge !== undefined) return cachedBridge;

  try {
    cachedBridge = requireNativeModule<TimeLeftWidgetBridgeModule>('TimeLeftWidgetBridge');
  } catch {
    cachedBridge = null;
  }

  return cachedBridge;
}

export async function writeIOSWidgetData(payload: IOSWidgetPayload): Promise<boolean> {
  const bridge = getBridge();
  if (!bridge) return false;

  return bridge.setWidgetData(JSON.stringify(payload));
}

export async function clearIOSWidgetData(): Promise<boolean> {
  const bridge = getBridge();
  if (!bridge) return false;

  return bridge.clearWidgetData();
}
