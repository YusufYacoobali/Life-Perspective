import React from 'react';
import { FlexWidget, OverlapWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { WidgetData } from './widgetData';

function polarPoint(cx: number, cy: number, r: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: cx + Math.cos(radians) * r,
    y: cy + Math.sin(radians) * r,
  };
}

function arcPath(cx: number, cy: number, r: number, startDegrees: number, endDegrees: number) {
  const start = polarPoint(cx, cy, r, startDegrees);
  const end = polarPoint(cx, cy, r, endDegrees);
  const largeArc = Math.abs(endDegrees - startDegrees) > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function buildArcSvg(data: WidgetData): string {
  const start = 180;
  const end = 360;
  const progress = Math.min(Math.max(data.percentageLived / 100, 0), 1);
  const progressEnd = start + (end - start) * progress;
  const endpoint = polarPoint(120, 126, 92, progressEnd);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 158" width="240" height="158">
    <circle cx="120" cy="122" r="72" fill="#061017"/>
    <path d="${arcPath(120, 126, 92, start, end)}" fill="none" stroke="#26313A" stroke-width="12" stroke-linecap="round"/>
    <path d="${arcPath(120, 126, 92, start, progressEnd)}" fill="none" stroke="#8BE58E" stroke-width="12" stroke-linecap="round"/>
    <circle cx="${endpoint.x.toFixed(2)}" cy="${endpoint.y.toFixed(2)}" r="6.5" fill="#8BE58E" stroke="#EAF8E9" stroke-width="2"/>
  </svg>`;
}

interface LifeArcWidgetProps {
  data: WidgetData;
}

export function LifeArcWidget({ data }: LifeArcWidgetProps) {
  const yearsLived = Math.max(0, Math.floor(data.weeksLived / 52));
  const totalYears = Math.max(yearsLived + Math.round(data.yearsRemaining), Math.round(data.totalWeeksEstimated / 52));
  const yearsRemaining = Math.max(0, Math.round(data.yearsRemaining));
  const completed = Math.round(data.percentageLived);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#060A0F',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#27313B',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
      clickAction="OPEN_APP"
    >
      <OverlapWidget style={{ width: 'match_parent', height: 136 }}>
        <SvgWidget svg={buildArcSvg(data)} style={{ width: 'match_parent', height: 136 }} />
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 125,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <TextWidget text="AGE" style={{ fontSize: 9, color: '#9BA4AB', fontWeight: '800' }} />
          <TextWidget text={`${yearsLived}`} style={{ fontSize: 36, color: '#F4EFE6', fontWeight: '300' }} />
          <TextWidget text={`of ${totalYears} years`} style={{ fontSize: 13, color: '#BFC7C3', fontWeight: '600' }} />
        </FlexWidget>
      </OverlapWidget>

      <FlexWidget style={{ height: 1, width: 'match_parent', backgroundColor: '#142029' }} />

      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <FlexWidget style={{ width: 78, flexDirection: 'column', alignItems: 'center' }}>
          <TextWidget text={`${completed}%`} style={{ fontSize: 18, color: '#8BE58E', fontWeight: '700' }} />
          <TextWidget text="completed" style={{ fontSize: 9, color: '#9BA4AB' }} />
        </FlexWidget>
        <FlexWidget style={{ width: 1, height: 34, backgroundColor: '#18242D' }} />
        <FlexWidget style={{ width: 78, flexDirection: 'column', alignItems: 'center' }}>
          <TextWidget text={`${yearsRemaining}`} style={{ fontSize: 18, color: '#8BE58E', fontWeight: '700' }} />
          <TextWidget text="years left" style={{ fontSize: 9, color: '#9BA4AB' }} />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
