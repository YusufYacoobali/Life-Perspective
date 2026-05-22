import { clearIOSWidgetData, writeIOSWidgetData } from '../native/iosWidgetBridge';
import { WidgetData } from './widgetData';

export async function refreshPlatformWidgets(widgetData: WidgetData): Promise<void> {
  await writeIOSWidgetData(widgetData);
}

export async function clearPlatformWidgets(): Promise<void> {
  await clearIOSWidgetData();
}
