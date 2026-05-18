import React from 'react';
import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { WidgetData } from './widgetData';

function buildGridSvg(data: WidgetData): string {
  const cols = 32;
  const rows = 8;
  const total = cols * rows;
  const livedRatio = data.weeksLived / Math.max(data.totalWeeksEstimated, 1);
  const lived = Math.min(total - 1, Math.max(0, Math.round(livedRatio * total)));
  const cell = 10.6;
  const ox = 8;
  const oy = 8;
  const parts: string[] = [];

  for (let i = 0; i < total; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = ox + col * cell;
    const y = oy + row * cell;
    const active = i < lived;
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.05" fill="${active ? '#F4EFE6' : '#34404A'}" opacity="${active ? 0.96 : 0.58}"/>`,
    );
  }

  const currentCol = lived % cols;
  const currentRow = Math.floor(lived / cols);
  const cx = ox + currentCol * cell;
  const cy = oy + currentRow * cell;
  parts.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5.1" fill="none" stroke="#F4EFE6" stroke-width="1.8"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 100" width="352" height="100">
    ${parts.join('')}
  </svg>`;
}

interface LifeLeftGridWidgetProps {
  data: WidgetData;
}

export function LifeLeftGridWidget({ data }: LifeLeftGridWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#060A0F',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#27313B',
        padding: 12,
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget text="Your Life In Perspective" style={{ fontSize: 15, color: '#EEE8DE', fontWeight: '700' }} />
      <SvgWidget svg={buildGridSvg(data)} style={{ width: 'match_parent', height: 104 }} />
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TextWidget text={`${data.weeksLived.toLocaleString()} weeks lived`} style={{ fontSize: 11, color: '#F4EFE6' }} />
        <TextWidget text={`${data.weeksRemaining.toLocaleString()} remaining`} style={{ fontSize: 11, color: '#7E858D' }} />
      </FlexWidget>
    </FlexWidget>
  );
}
