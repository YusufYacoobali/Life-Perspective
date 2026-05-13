import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressWidget } from './ProgressWidget';
import { DaysLeftWidget } from './DaysLeftWidget';

const WIDGET_DATA_KEY = '@time_left_widget_data';

interface WidgetData {
  percentageLived: number;
  daysRemaining: number;
  yearsRemaining: number;
  dailyQuote: string;
}

const DEFAULT_DATA: WidgetData = {
  percentageLived: 0,
  daysRemaining: 0,
  yearsRemaining: 0,
  dailyQuote: 'Make today count.',
};

async function getWidgetData(): Promise<WidgetData> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { renderWidget, widgetInfo } = props;
  const data = await getWidgetData();

  if (widgetInfo.widgetName === 'ProgressWidget') {
    renderWidget(
      React.createElement(ProgressWidget, {
        percentageLived: data.percentageLived,
        daysRemaining: data.daysRemaining,
        quote: data.dailyQuote,
      })
    );
  }

  if (widgetInfo.widgetName === 'DaysLeftWidget') {
    renderWidget(
      React.createElement(DaysLeftWidget, {
        daysRemaining: data.daysRemaining,
        yearsRemaining: data.yearsRemaining,
        quote: data.dailyQuote,
      })
    );
  }
}
