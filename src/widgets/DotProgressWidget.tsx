import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface DotProgressWidgetProps {
  percentageLived: number;
  yearsRemaining: number;
}

const TOTAL_DOTS = 22;

export function DotProgressWidget({ percentageLived, yearsRemaining }: DotProgressWidgetProps) {
  const pctRemaining = Math.max(0, Math.round(100 - percentageLived));
  const livedDots = Math.min(TOTAL_DOTS - 1, Math.max(0, Math.round((percentageLived / 100) * TOTAL_DOTS)));

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
        <TextWidget text="Life Left" style={{ fontSize: 16, color: '#CFC6BA' }} />
        <TextWidget text={`${pctRemaining}%`} style={{ fontSize: 29, color: '#FFC165', fontWeight: '300' }} />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
          const isSeparator = i === livedDots;
          const isLived = i < livedDots;
          return (
            <FlexWidget
              key={i}
              style={{
                width: isSeparator ? 2 : 5,
                height: isSeparator ? 18 : isLived ? 8 : 7,
                borderRadius: isSeparator ? 1 : 4,
                backgroundColor: isSeparator ? '#E7D8C9' : isLived ? '#FFC165' : '#252B37',
              }}
            />
          );
        })}
      </FlexWidget>

      <TextWidget
        text={`${yearsRemaining} years left`}
        style={{ fontSize: 15, color: '#ECE5D8' }}
      />
    </FlexWidget>
  );
}
