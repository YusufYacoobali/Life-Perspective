import { refreshAndroidWidgets } from './refreshAndroidWidgets';
import { DEFAULT_WIDGET_DATA, WidgetData } from './widgetData';

export async function refreshPlatformWidgets(widgetData: WidgetData): Promise<void> {
  await refreshAndroidWidgets(widgetData);
}

export async function clearPlatformWidgets(): Promise<void> {
  await refreshAndroidWidgets(DEFAULT_WIDGET_DATA);
}
