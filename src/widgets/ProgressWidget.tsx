import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface ProgressWidgetProps {
  percentageLived: number;
  daysRemaining: number;
  quote: string;
}

export function ProgressWidget({ percentageLived, daysRemaining, quote }: ProgressWidgetProps) {
  const pct = Math.min(Math.max(Math.round(percentageLived), 0), 100);
  const remaining = Math.max(0, 100 - pct);
  const barWidth = Math.round((160 * pct) / 100);
  const shortQuote = quote.length > 44 ? `${quote.slice(0, 41)}...` : quote;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#05080D',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#222A35',
        padding: 18,
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget
          text="LIFE PROGRESS"
          style={{ fontSize: 10, color: '#FF9A4A', fontWeight: '700' }}
        />
        <TextWidget
          text={`${remaining}% left`}
          style={{ fontSize: 14, color: '#FFC165', fontWeight: '700' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text={`${pct}% used`}
          style={{ fontSize: 38, color: '#F7F2E8', fontWeight: '200' }}
        />
        <TextWidget
          text={`~${daysRemaining.toLocaleString()} full days left`}
          style={{ fontSize: 11, color: '#A7A0A0' }}
        />
      </FlexWidget>

      <FlexWidget style={{ width: 'match_parent', height: 7, backgroundColor: '#18202B', borderRadius: 4 }}>
        <FlexWidget style={{ height: 7, width: barWidth, backgroundColor: '#68DAD4', borderRadius: 4 }} />
      </FlexWidget>

      <TextWidget
        text={shortQuote}
        style={{ fontSize: 10, color: '#5E6068' }}
      />
    </FlexWidget>
  );
}
