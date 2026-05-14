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
  <defs>
    <linearGradient id="amber" x1="22" y1="118" x2="118" y2="22" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FF943F"/>
      <stop offset="0.55" stop-color="#FFC45E"/>
      <stop offset="1" stop-color="#FF8A47"/>
    </linearGradient>
    <linearGradient id="ice" x1="110" y1="12" x2="140" y2="130" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#24313D"/>
      <stop offset="1" stop-color="#A8E7F4"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="75" cy="75" r="43" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>
  <path d="${bgPath}" fill="none" stroke="#1A222E" stroke-width="12" stroke-linecap="round"/>
  <path d="${bgPath}" fill="none" stroke="url(#ice)" stroke-width="8" stroke-linecap="round" opacity="0.34"/>
  ${amberPath ? `<path d="${amberPath}" fill="none" stroke="url(#amber)" stroke-width="12" stroke-linecap="round" filter="url(#glow)"/>` : ''}
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
        backgroundColor: '#05080D',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#222A35',
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
            style={{ fontSize: 25, color: '#F7F2E8', fontWeight: '200' }}
          />
          <TextWidget
            text="AHEAD"
            style={{ fontSize: 8, color: '#9A9AA6', fontWeight: '700' }}
          />
          <TextWidget
            text={`${yearsRemaining}`}
            style={{ fontSize: 25, color: '#F7F2E8', fontWeight: '200' }}
          />
          <TextWidget
            text="YEARS LEFT"
            style={{ fontSize: 8, color: '#FFC165', fontWeight: '700' }}
          />
        </FlexWidget>
      </OverlapWidget>
    </FlexWidget>
  );
}
