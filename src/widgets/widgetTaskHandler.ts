import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LifeLeftGridWidget } from './LifeLeftGridWidget';
import { LifeArcWidget } from './LifeArcWidget';
import { TodayLeftWidget } from './TodayLeftWidget';
import { MilestoneCountdownWidget } from './MilestoneCountdownWidget';
import { DEFAULT_WIDGET_DATA, WidgetData } from './widgetData';

const WIDGET_DATA_KEY = '@time_left_widget_data';

async function getWidgetData(): Promise<WidgetData> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    return raw ? { ...DEFAULT_WIDGET_DATA, ...JSON.parse(raw) } : DEFAULT_WIDGET_DATA;
  } catch {
    return DEFAULT_WIDGET_DATA;
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { renderWidget, widgetInfo } = props;
  const data = await getWidgetData();

  if (widgetInfo.widgetName === 'LifeLeftGridWidget') {
    renderWidget(React.createElement(LifeLeftGridWidget, { data }));
  }

  if (widgetInfo.widgetName === 'LifeArcWidget') {
    renderWidget(React.createElement(LifeArcWidget, { data }));
  }

  if (widgetInfo.widgetName === 'TodayLeftWidget') {
    renderWidget(React.createElement(TodayLeftWidget, { data }));
  }

  if (widgetInfo.widgetName === 'MilestoneCountdownWidget') {
    renderWidget(React.createElement(MilestoneCountdownWidget, { data }));
  }
}
