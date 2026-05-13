import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface DaysLeftWidgetProps {
  daysRemaining: number;
  yearsRemaining: number;
  quote: string;
}

export function DaysLeftWidget({ daysRemaining, yearsRemaining, quote }: DaysLeftWidgetProps) {
  const shortQuote = quote.length > 58 ? `${quote.slice(0, 55)}...` : quote;

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
        <TextWidget text="DAYS LEFT" style={{ fontSize: 9, color: '#FF8A47', fontWeight: '700' }} />
        <TextWidget text={`${yearsRemaining}y`} style={{ fontSize: 13, color: '#55C7C1', fontWeight: '700' }} />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text={daysRemaining.toLocaleString()}
          style={{ fontSize: 38, color: '#F7F2E8', fontWeight: '200' }}
        />
        <TextWidget
          text="estimated full days remaining"
          style={{ fontSize: 10, color: '#A7A0A0' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <FlexWidget
            key={i}
            style={{
              width: 11,
              height: 11,
              borderRadius: 6,
              marginRight: 4,
              backgroundColor: i < 5 ? '#6E7A8F' : i === 5 ? '#FF8A47' : '#20242C',
            }}
          />
        ))}
      </FlexWidget>

      <TextWidget text={shortQuote} style={{ fontSize: 10, color: '#5E6068' }} />
    </FlexWidget>
  );
}
