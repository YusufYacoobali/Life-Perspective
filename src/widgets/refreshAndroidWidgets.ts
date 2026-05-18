import React from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { LifeLeftGridWidget } from './LifeLeftGridWidget';
import { LifeArcWidget } from './LifeArcWidget';
import { TodayLeftWidget } from './TodayLeftWidget';
import { MilestoneCountdownWidget } from './MilestoneCountdownWidget';
import { WidgetData } from './widgetData';

const WIDGET_NAMES = [
  'LifeLeftGridWidget',
  'LifeArcWidget',
  'TodayLeftWidget',
  'MilestoneCountdownWidget',
] as const;

function renderWidget(widgetName: (typeof WIDGET_NAMES)[number], data: WidgetData) {
  switch (widgetName) {
    case 'LifeLeftGridWidget':
      return React.createElement(LifeLeftGridWidget, { data });
    case 'LifeArcWidget':
      return React.createElement(LifeArcWidget, { data });
    case 'TodayLeftWidget':
      return React.createElement(TodayLeftWidget, { data });
    case 'MilestoneCountdownWidget':
      return React.createElement(MilestoneCountdownWidget, { data });
  }
}

export async function refreshAndroidWidgets(data: WidgetData): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Promise.all(
    WIDGET_NAMES.map((widgetName) =>
      requestWidgetUpdate({
        widgetName,
        renderWidget: () => renderWidget(widgetName, data),
      }),
    ),
  );
}
