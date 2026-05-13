import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface ProgressWidgetProps {
  percentageLived: number;
  daysRemaining: number;
  quote: string;
}

export function ProgressWidget({ percentageLived, daysRemaining, quote }: ProgressWidgetProps) {
  const pct = Math.min(Math.max(Math.round(percentageLived), 0), 100);
  const barWidth = Math.round((132 * pct) / 100);
  const shortQuote = quote.length > 44 ? `${quote.slice(0, 41)}...` : quote;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#07080A',
        borderRadius: 18,
        padding: 15,
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget
          text="PERSPECTIVE"
          style={{ fontSize: 9, color: '#FF8A47', fontWeight: '700' }}
        />
        <TextWidget
          text={`${pct}%`}
          style={{ fontSize: 16, color: '#F7F2E8', fontWeight: '700' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text={`${pct}% used`}
          style={{ fontSize: 32, color: '#F7F2E8', fontWeight: '200' }}
        />
        <TextWidget
          text={`~${daysRemaining.toLocaleString()} full days left`}
          style={{ fontSize: 11, color: '#A7A0A0' }}
        />
      </FlexWidget>

      <FlexWidget style={{ width: 'match_parent', height: 5, backgroundColor: '#20242C', borderRadius: 3 }}>
        <FlexWidget style={{ height: 5, width: barWidth, backgroundColor: '#55C7C1', borderRadius: 3 }} />
      </FlexWidget>

      <TextWidget
        text={shortQuote}
        style={{ fontSize: 10, color: '#5E6068' }}
      />
    </FlexWidget>
  );
}
