import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface DotProgressWidgetProps {
  percentageLived: number;
  yearsRemaining: number;
}

const TOTAL_DOTS = 22;

export function DotProgressWidget({ percentageLived, yearsRemaining }: DotProgressWidgetProps) {
  const pctRemaining = Math.round(100 - percentageLived);
  const livedDots = Math.round((percentageLived / 100) * TOTAL_DOTS);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#111318',
        borderRadius: 20,
        padding: 16,
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget text="Life Left" style={{ fontSize: 15, color: '#C8BEB4' }} />
        <TextWidget text={`${pctRemaining}%`} style={{ fontSize: 22, color: '#FF8A47', fontWeight: '700' }} />
      </FlexWidget>

      {/* Dot row: amber lived dots, thin separator bar, faded remaining dots */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
          const isSeparator = i === livedDots;
          const isLived = i < livedDots;
          return (
            <FlexWidget
              key={i}
              style={{
                width: isSeparator ? 2 : 6,
                height: isSeparator ? 14 : 6,
                borderRadius: isSeparator ? 1 : 3,
                marginRight: 4,
                backgroundColor: isSeparator ? '#C8BEB4' : isLived ? '#FF8A47' : '#252B37',
              }}
            />
          );
        })}
      </FlexWidget>

      <TextWidget
        text={`${yearsRemaining} years left`}
        style={{ fontSize: 14, color: '#D9D4CA' }}
      />
    </FlexWidget>
  );
}
