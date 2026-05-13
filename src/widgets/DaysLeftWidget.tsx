import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface DaysLeftWidgetProps {
  daysRemaining: number;
  yearsRemaining: number;
  quote: string;
}

export function DaysLeftWidget({ daysRemaining, yearsRemaining, quote }: DaysLeftWidgetProps) {
  const shortQuote = quote.length > 55 ? quote.slice(0, 52) + '...' : quote;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#111111',
        borderRadius: 16,
        padding: 16,
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text={`~${daysRemaining.toLocaleString()}`}
          style={{
            fontSize: 32,
            color: '#F2EFE8',
            fontWeight: '200',
          }}
        />
        <TextWidget
          text="days left"
          style={{
            fontSize: 12,
            color: '#8E8E93',
          }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text={`${yearsRemaining} years remaining`}
          style={{
            fontSize: 11,
            color: '#6BA3C4',
          }}
        />
        <TextWidget
          text={`"${shortQuote}"`}
          style={{
            fontSize: 10,
            color: '#48484A',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
