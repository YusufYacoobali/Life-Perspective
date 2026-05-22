import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgetTaskHandler';

export function registerNativeWidgetTaskHandler(): void {
  registerWidgetTaskHandler(widgetTaskHandler);
}
