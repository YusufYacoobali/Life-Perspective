import React from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { ProgressWidget } from './ProgressWidget';
import { DaysLeftWidget } from './DaysLeftWidget';
import { DotProgressWidget } from './DotProgressWidget';
import { ArcWidget } from './ArcWidget';

export interface AndroidWidgetData {
  percentageLived: number;
  daysRemaining: number;
  yearsRemaining: number;
  dailyQuote: string;
}

const WIDGET_NAMES = ['ProgressWidget', 'DaysLeftWidget', 'DotProgressWidget', 'ArcWidget'] as const;

function renderWidget(widgetName: (typeof WIDGET_NAMES)[number], data: AndroidWidgetData) {
  switch (widgetName) {
    case 'ProgressWidget':
      return React.createElement(ProgressWidget, {
        percentageLived: data.percentageLived,
        daysRemaining: data.daysRemaining,
        quote: data.dailyQuote,
      });
    case 'DaysLeftWidget':
      return React.createElement(DaysLeftWidget, {
        daysRemaining: data.daysRemaining,
        yearsRemaining: data.yearsRemaining,
        quote: data.dailyQuote,
      });
    case 'DotProgressWidget':
      return React.createElement(DotProgressWidget, {
        percentageLived: data.percentageLived,
        yearsRemaining: data.yearsRemaining,
      });
    case 'ArcWidget':
      return React.createElement(ArcWidget, {
        percentageLived: data.percentageLived,
        yearsRemaining: data.yearsRemaining,
      });
  }
}

export async function refreshAndroidWidgets(data: AndroidWidgetData): Promise<void> {
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
