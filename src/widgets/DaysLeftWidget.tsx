import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface DaysLeftWidgetProps {
  daysRemaining: number;
  yearsRemaining: number;
  quote: string;
}

export function DaysLeftWidget({ daysRemaining, yearsRemaining, quote }: DaysLeftWidgetProps) {
  const shortQuote = quote.length > 58 ? `${quote.slice(0, 55)}...` : quote;
  const yearsLabel = yearsRemaining > 0 ? `${yearsRemaining} years left` : 'estimate reached';

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
        <TextWidget text="LIFE PERSPECTIVE" style={{ fontSize: 10, color: '#FF9A4A', fontWeight: '700' }} />
        <TextWidget text={`${Math.max(0, yearsRemaining)}y`} style={{ fontSize: 16, color: '#EDE5D8', fontWeight: '600' }} />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text={daysRemaining.toLocaleString()}
          style={{ fontSize: 46, color: '#F7F2E8', fontWeight: '200' }}
        />
        <TextWidget
          text="full days left"
          style={{ fontSize: 18, color: '#BEB7AE', fontWeight: '700' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <FlexWidget
            key={i}
            style={{
              width: i === 5 ? 15 : 12,
              height: i === 5 ? 15 : 12,
              borderRadius: 8,
              marginRight: 6,
              backgroundColor: i < 5 ? '#626A78' : i === 5 ? '#FF9A4A' : '#161C27',
            }}
          />
        ))}
      </FlexWidget>

      <TextWidget text={`${yearsLabel} / "${shortQuote}"`} style={{ fontSize: 10, color: '#626A78' }} />
    </FlexWidget>
  );
}
