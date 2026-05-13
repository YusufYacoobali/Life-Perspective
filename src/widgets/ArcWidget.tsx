import React from 'react';
import { FlexWidget, TextWidget, OverlapWidget, SvgWidget } from 'react-native-android-widget';

function buildArcSvg(percentageLived: number): string {
  const remaining = Math.max(0, Math.min(100, 100 - percentageLived));
  const cx = 75, cy = 75, r = 60;
  const startDeg = 135;
  const totalDeg = 270;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (deg: number) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  });

  const arcStart = pt(startDeg);
  const arcEnd = pt(startDeg + totalDeg);
  const amberDeg = (remaining / 100) * totalDeg;
  const amberEnd = pt(startDeg + amberDeg);
  const amberLarge = amberDeg > 180 ? 1 : 0;
  const f = (n: number) => n.toFixed(2);

  const bgPath = `M ${f(arcStart.x)} ${f(arcStart.y)} A ${r} ${r} 0 1 1 ${f(arcEnd.x)} ${f(arcEnd.y)}`;
  const amberPath =
    amberDeg > 0.5
      ? `M ${f(arcStart.x)} ${f(arcStart.y)} A ${r} ${r} 0 ${amberLarge} 1 ${f(amberEnd.x)} ${f(amberEnd.y)}`
      : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="150" height="150">
  <path d="${bgPath}" fill="none" stroke="#1E2430" stroke-width="11" stroke-linecap="round"/>
  ${amberPath ? `<path d="${amberPath}" fill="none" stroke="#FF8A47" stroke-width="11" stroke-linecap="round"/>` : ''}
</svg>`;

  return svg;
}

interface ArcWidgetProps {
  percentageLived: number;
  yearsRemaining: number;
}

export function ArcWidget({ percentageLived, yearsRemaining }: ArcWidgetProps) {
  const remaining = (100 - percentageLived).toFixed(1);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0D0F14',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      clickAction="OPEN_APP"
    >
      <OverlapWidget style={{ width: 150, height: 150 }}>
        <SvgWidget svg={buildArcSvg(percentageLived)} style={{ width: 150, height: 150 }} />
        <FlexWidget
          style={{
            width: 150,
            height: 150,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text={`${remaining}%`}
            style={{ fontSize: 24, color: '#F7F2E8', fontWeight: '200' }}
          />
          <TextWidget
            text="AHEAD"
            style={{ fontSize: 8, color: '#8A8A96', fontWeight: '700' }}
          />
          <TextWidget
            text={`${yearsRemaining}`}
            style={{ fontSize: 20, color: '#F7F2E8', fontWeight: '200' }}
          />
          <TextWidget
            text="YEARS LEFT"
            style={{ fontSize: 8, color: '#FF8A47', fontWeight: '700' }}
          />
        </FlexWidget>
      </OverlapWidget>
    </FlexWidget>
  );
}
