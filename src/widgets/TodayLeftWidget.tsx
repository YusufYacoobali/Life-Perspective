import React from 'react';
import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { getDailyQuote } from '../lib/quotes';
import { getTodayCountdown, WidgetData } from './widgetData';

function buildTodaySvg(elapsedPercentage: number): string {
  const width = Math.max(8, Math.round((230 * elapsedPercentage) / 100));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 82" width="260" height="82">
    <rect x="15" y="13" width="230" height="2" rx="1" fill="#222B36"/>
    <rect x="15" y="13" width="${width}" height="2" rx="1" fill="#FF9A3C"/>
    <circle cx="130" cy="54" r="8" fill="none" stroke="#F49A33" stroke-width="2"/>
    <line x1="130" y1="40" x2="130" y2="35" stroke="#F49A33" stroke-width="1.5"/>
    <line x1="130" y1="73" x2="130" y2="68" stroke="#F49A33" stroke-width="1.5"/>
    <line x1="116" y1="54" x2="111" y2="54" stroke="#F49A33" stroke-width="1.5"/>
    <line x1="149" y1="54" x2="144" y2="54" stroke="#F49A33" stroke-width="1.5"/>
    <line x1="120" y1="44" x2="116" y2="40" stroke="#F49A33" stroke-width="1.3"/>
    <line x1="144" y1="68" x2="140" y2="64" stroke="#F49A33" stroke-width="1.3"/>
    <line x1="140" y1="44" x2="144" y2="40" stroke="#F49A33" stroke-width="1.3"/>
    <line x1="116" y1="68" x2="120" y2="64" stroke="#F49A33" stroke-width="1.3"/>
  </svg>`;
}

interface TodayLeftWidgetProps {
  data: WidgetData;
}

export function TodayLeftWidget({ data }: TodayLeftWidgetProps) {
  const today = getTodayCountdown();
  const label = today.label || data.todayTimeLeftLabel;
  const quote = getDailyQuote().text || data.dailyQuote;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#060A0F',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#27313B',
        padding: 18,
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget text={label} style={{ fontSize: 34, color: '#FF9A3C', fontWeight: '700' }} />
      <TextWidget text="left until midnight" style={{ fontSize: 16, color: '#F0EAE0' }} />
      <SvgWidget svg={buildTodaySvg(today.elapsedPercentage)} style={{ width: 'match_parent', height: 82 }} />
      <TextWidget
        text={quote}
        truncate="END"
        maxLines={1}
        style={{ fontSize: 13, color: '#C9C1B7', fontStyle: 'italic', textAlign: 'center' }}
      />
    </FlexWidget>
  );
}
