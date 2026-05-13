import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface ProgressWidgetProps {
  percentageLived: number;
  daysRemaining: number;
  quote: string;
}

export function ProgressWidget({ percentageLived, daysRemaining }: ProgressWidgetProps) {
  const pct = Math.min(Math.max(Math.round(percentageLived), 0), 100);
  const barWidth = Math.round((110 * pct) / 100);

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
          text={`${pct}%`}
          style={{
            fontSize: 36,
            color: '#F2EFE8',
            fontWeight: '200',
          }}
        />
        <TextWidget
          text="of life used"
          style={{
            fontSize: 11,
            color: '#8E8E93',
          }}
        />
      </FlexWidget>

      {/* Progress bar */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 4,
          backgroundColor: '#2C2C2E',
          borderRadius: 2,
        }}
      >
        <FlexWidget
          style={{
            height: 4,
            width: barWidth,
            backgroundColor: '#6BA3C4',
            borderRadius: 2,
          }}
        />
      </FlexWidget>

      <TextWidget
        text={`~${daysRemaining.toLocaleString()} days left`}
        style={{
          fontSize: 11,
          color: '#8E8E93',
        }}
      />
    </FlexWidget>
  );
}
