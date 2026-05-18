import React from 'react';
import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { WidgetData, WidgetMilestone } from './widgetData';

function toneColor(tone: WidgetMilestone['tone']) {
  switch (tone) {
    case 'pink':
      return '#FF5E93';
    case 'blue':
      return '#7A93D9';
    case 'green':
      return '#8BE58E';
    case 'amber':
      return '#F5A742';
  }
}

function iconSvg(milestone: WidgetMilestone): string {
  const color = toneColor(milestone.tone);
  const title = milestone.title.toLowerCase();
  const inner = title.includes('birthday')
    ? '<path d="M8 13H24V25H8Z M6 10H26V14H6Z M16 10V25 M11 10C7 7 10 4 16 10 M21 10C25 7 22 4 16 10" fill="none" stroke="COLOR" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>'
    : title.includes('year')
      ? '<path d="M16 6V10 M16 22V26 M6 16H10 M22 16H26 M9 9L12 12 M20 20L23 23 M23 9L20 12 M12 20L9 23" stroke="COLOR" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="16" r="4.2" fill="none" stroke="COLOR" stroke-width="1.7"/>'
      : title.includes('retirement')
        ? '<path d="M7 12H25V24H7Z M12 12V9H20V12 M7 16H25 M15 18H17" fill="none" stroke="COLOR" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<path d="M9 7H23V25H9Z M12 5V10 M20 5V10 M9 12H23 M12 17H15 M17 17H20 M12 21H15" fill="none" stroke="COLOR" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <rect x="2.5" y="2.5" width="27" height="27" rx="8" fill="#081119" stroke="${color}" stroke-width="1.4"/>
    ${inner.replace(/COLOR/g, color)}
  </svg>`;
}

interface MilestoneCountdownWidgetProps {
  data: WidgetData;
}

export function MilestoneCountdownWidget({ data }: MilestoneCountdownWidgetProps) {
  const milestones = data.milestones.length ? data.milestones : [];

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        backgroundColor: '#060A0F',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#27313B',
        padding: 14,
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget text="Upcoming Milestones" style={{ fontSize: 16, color: '#F0EAE0', fontWeight: '700' }} />
      <FlexWidget style={{ height: 1, width: 'match_parent', backgroundColor: '#222B36', marginTop: 7, marginBottom: 3 }} />

      {milestones.map((milestone, index) => (
        <FlexWidget key={`${milestone.title}-${index}`} style={{ width: 'match_parent', flexDirection: 'column' }}>
          <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', paddingTop: 6, paddingBottom: 6 }}>
            <SvgWidget svg={iconSvg(milestone)} style={{ width: 31, height: 31, marginRight: 11 }} />
            <FlexWidget style={{ flex: 1 }}>
              <TextWidget text={milestone.title} style={{ fontSize: 14, color: '#F0EAE0', fontWeight: '700' }} />
            </FlexWidget>
            <FlexWidget style={{ width: 76, flexDirection: 'column', alignItems: 'flex-end' }}>
              <TextWidget text={milestone.days.toLocaleString()} style={{ fontSize: 18, color: toneColor(milestone.tone), fontWeight: '800' }} />
              <TextWidget text="days" style={{ fontSize: 11, color: '#B8B4AE' }} />
            </FlexWidget>
          </FlexWidget>
          {index < milestones.length - 1 ? <FlexWidget style={{ height: 1, width: 'match_parent', backgroundColor: '#1C232C' }} /> : null}
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}
