export interface CountryData {
  code: string;
  name: string;
  // LE = life expectancy, stored as estimated years for the selected sex.
  maleLE: number;
  femaleLE: number;
  // Country factors are rough 0+ multipliers for perspective metrics, not medical inputs:
  // 1.0 means around the baseline assumption, 0.5 means about half that baseline,
  // and values above 1 mean the country tends to support more of that event/item.
  travelFactor?: number;
  carFactor?: number;
  phoneFactor?: number;
  homeFactor?: number;
}

export const LIFE_EXPECTANCY_SOURCES = [
  {
    name: 'World Bank - Life expectancy at birth, male (years)',
    url: 'https://data.worldbank.org/indicator/SP.DYN.LE00.MA.IN',
  },
  {
    name: 'World Bank - Life expectancy at birth, female (years)',
    url: 'https://data.worldbank.org/indicator/SP.DYN.LE00.FE.IN',
  },
  {
    name: 'World Health Organization - Life expectancy at birth (years)',
    url: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/life-expectancy-at-birth-(years)',
  },
] as const;

export const LIFE_EXPECTANCY_DISCLAIMER =
  'Life expectancy values are rounded country-level estimates for reflection only. They are not medical advice, diagnosis, prediction, or a personal health assessment.';

// Approximate, editable country baselines used for reflection rather than exact prediction.
// maleLE/femaleLE are rounded from public life-expectancy sources; keep sources visible in-app.
// travelFactor/carFactor/phoneFactor/homeFactor are gameplay/perspective multipliers only.
const COUNTRY_ROWS: CountryData[] = [
  { code: 'AF', name: 'Afghanistan', maleLE: 61, femaleLE: 65, travelFactor: 0.15, carFactor: 0.25, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'AL', name: 'Albania', maleLE: 75, femaleLE: 80, travelFactor: 0.45, carFactor: 0.65, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'DZ', name: 'Algeria', maleLE: 74, femaleLE: 78, travelFactor: 0.3, carFactor: 0.55, phoneFactor: 0.6, homeFactor: 0.5 },
  { code: 'AO', name: 'Angola', maleLE: 61, femaleLE: 66, travelFactor: 0.18, carFactor: 0.25, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'AR', name: 'Argentina', maleLE: 74, femaleLE: 80, travelFactor: 0.55, carFactor: 0.75, phoneFactor: 0.7, homeFactor: 0.65 },
  { code: 'AM', name: 'Armenia', maleLE: 72, femaleLE: 79, travelFactor: 0.35, carFactor: 0.55, phoneFactor: 0.6, homeFactor: 0.55 },
  { code: 'AU', name: 'Australia', maleLE: 81, femaleLE: 85, travelFactor: 1.25, carFactor: 1.2, phoneFactor: 1.05, homeFactor: 1.0 },
  { code: 'AT', name: 'Austria', maleLE: 79, femaleLE: 84, travelFactor: 1.2, carFactor: 1.0, phoneFactor: 1.0, homeFactor: 0.9 },
  { code: 'AZ', name: 'Azerbaijan', maleLE: 70, femaleLE: 76, travelFactor: 0.35, carFactor: 0.55, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'BD', name: 'Bangladesh', maleLE: 71, femaleLE: 74, travelFactor: 0.18, carFactor: 0.2, phoneFactor: 0.55, homeFactor: 0.45 },
  { code: 'BY', name: 'Belarus', maleLE: 69, femaleLE: 79, travelFactor: 0.45, carFactor: 0.7, phoneFactor: 0.7, homeFactor: 0.55 },
  { code: 'BE', name: 'Belgium', maleLE: 79, femaleLE: 83, travelFactor: 1.15, carFactor: 0.95, phoneFactor: 1.0, homeFactor: 0.85 },
  { code: 'BO', name: 'Bolivia', maleLE: 69, femaleLE: 75, travelFactor: 0.25, carFactor: 0.35, phoneFactor: 0.55, homeFactor: 0.5 },
  { code: 'BA', name: 'Bosnia and Herzegovina', maleLE: 75, femaleLE: 80, travelFactor: 0.5, carFactor: 0.7, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'BR', name: 'Brazil', maleLE: 72, femaleLE: 79, travelFactor: 0.45, carFactor: 0.65, phoneFactor: 0.7, homeFactor: 0.65 },
  { code: 'BG', name: 'Bulgaria', maleLE: 71, femaleLE: 78, travelFactor: 0.65, carFactor: 0.75, phoneFactor: 0.75, homeFactor: 0.6 },
  { code: 'KH', name: 'Cambodia', maleLE: 67, femaleLE: 72, travelFactor: 0.18, carFactor: 0.2, phoneFactor: 0.5, homeFactor: 0.45 },
  { code: 'CM', name: 'Cameroon', maleLE: 60, femaleLE: 64, travelFactor: 0.15, carFactor: 0.2, phoneFactor: 0.4, homeFactor: 0.45 },
  { code: 'CA', name: 'Canada', maleLE: 80, femaleLE: 84, travelFactor: 1.1, carFactor: 1.15, phoneFactor: 1.0, homeFactor: 1.0 },
  { code: 'CL', name: 'Chile', maleLE: 78, femaleLE: 83, travelFactor: 0.75, carFactor: 0.75, phoneFactor: 0.8, homeFactor: 0.7 },
  { code: 'CN', name: 'China', maleLE: 75, femaleLE: 79, travelFactor: 0.35, carFactor: 0.55, phoneFactor: 0.85, homeFactor: 0.6 },
  { code: 'CO', name: 'Colombia', maleLE: 73, femaleLE: 79, travelFactor: 0.45, carFactor: 0.55, phoneFactor: 0.7, homeFactor: 0.6 },
  { code: 'CR', name: 'Costa Rica', maleLE: 77, femaleLE: 82, travelFactor: 0.65, carFactor: 0.65, phoneFactor: 0.75, homeFactor: 0.65 },
  { code: 'CI', name: "Cote d'Ivoire", maleLE: 58, femaleLE: 61, travelFactor: 0.12, carFactor: 0.18, phoneFactor: 0.4, homeFactor: 0.4 },
  { code: 'HR', name: 'Croatia', maleLE: 76, femaleLE: 82, travelFactor: 0.8, carFactor: 0.85, phoneFactor: 0.8, homeFactor: 0.65 },
  { code: 'CU', name: 'Cuba', maleLE: 77, femaleLE: 81, travelFactor: 0.25, carFactor: 0.25, phoneFactor: 0.45, homeFactor: 0.55 },
  { code: 'CZ', name: 'Czech Republic', maleLE: 76, femaleLE: 81, travelFactor: 0.9, carFactor: 0.9, phoneFactor: 0.85, homeFactor: 0.65 },
  { code: 'DK', name: 'Denmark', maleLE: 79, femaleLE: 83, travelFactor: 1.25, carFactor: 0.9, phoneFactor: 1.0, homeFactor: 0.85 },
  { code: 'DO', name: 'Dominican Republic', maleLE: 70, femaleLE: 77, travelFactor: 0.35, carFactor: 0.45, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'EC', name: 'Ecuador', maleLE: 74, femaleLE: 80, travelFactor: 0.35, carFactor: 0.5, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'EG', name: 'Egypt', maleLE: 70, femaleLE: 74, travelFactor: 0.25, carFactor: 0.4, phoneFactor: 0.6, homeFactor: 0.5 },
  { code: 'SV', name: 'El Salvador', maleLE: 68, femaleLE: 78, travelFactor: 0.25, carFactor: 0.35, phoneFactor: 0.55, homeFactor: 0.5 },
  { code: 'EE', name: 'Estonia', maleLE: 74, femaleLE: 82, travelFactor: 0.9, carFactor: 0.9, phoneFactor: 0.9, homeFactor: 0.65 },
  { code: 'ET', name: 'Ethiopia', maleLE: 64, femaleLE: 68, travelFactor: 0.12, carFactor: 0.12, phoneFactor: 0.35, homeFactor: 0.4 },
  { code: 'FI', name: 'Finland', maleLE: 79, femaleLE: 84, travelFactor: 1.15, carFactor: 1.0, phoneFactor: 1.0, homeFactor: 0.85 },
  { code: 'FR', name: 'France', maleLE: 79, femaleLE: 85, travelFactor: 1.15, carFactor: 0.9, phoneFactor: 0.95, homeFactor: 0.8 },
  { code: 'GE', name: 'Georgia', maleLE: 70, femaleLE: 78, travelFactor: 0.4, carFactor: 0.55, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'DE', name: 'Germany', maleLE: 79, femaleLE: 84, travelFactor: 1.15, carFactor: 1.0, phoneFactor: 1.0, homeFactor: 0.85 },
  { code: 'GH', name: 'Ghana', maleLE: 63, femaleLE: 67, travelFactor: 0.18, carFactor: 0.25, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'GR', name: 'Greece', maleLE: 79, femaleLE: 84, travelFactor: 0.75, carFactor: 0.9, phoneFactor: 0.85, homeFactor: 0.7 },
  { code: 'GT', name: 'Guatemala', maleLE: 70, femaleLE: 76, travelFactor: 0.22, carFactor: 0.35, phoneFactor: 0.55, homeFactor: 0.5 },
  { code: 'HN', name: 'Honduras', maleLE: 70, femaleLE: 75, travelFactor: 0.2, carFactor: 0.3, phoneFactor: 0.55, homeFactor: 0.5 },
  { code: 'HK', name: 'Hong Kong', maleLE: 82, femaleLE: 88, travelFactor: 1.1, carFactor: 0.35, phoneFactor: 1.15, homeFactor: 0.75 },
  { code: 'HU', name: 'Hungary', maleLE: 73, femaleLE: 79, travelFactor: 0.75, carFactor: 0.8, phoneFactor: 0.8, homeFactor: 0.6 },
  { code: 'IS', name: 'Iceland', maleLE: 81, femaleLE: 84, travelFactor: 1.3, carFactor: 1.1, phoneFactor: 1.0, homeFactor: 0.9 },
  { code: 'IN', name: 'India', maleLE: 68, femaleLE: 71, travelFactor: 0.2, carFactor: 0.25, phoneFactor: 0.6, homeFactor: 0.45 },
  { code: 'ID', name: 'Indonesia', maleLE: 69, femaleLE: 73, travelFactor: 0.22, carFactor: 0.3, phoneFactor: 0.6, homeFactor: 0.5 },
  { code: 'IR', name: 'Iran', maleLE: 74, femaleLE: 78, travelFactor: 0.25, carFactor: 0.65, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'IQ', name: 'Iraq', maleLE: 69, femaleLE: 73, travelFactor: 0.15, carFactor: 0.45, phoneFactor: 0.5, homeFactor: 0.45 },
  { code: 'IE', name: 'Ireland', maleLE: 80, femaleLE: 84, travelFactor: 1.25, carFactor: 1.0, phoneFactor: 1.0, homeFactor: 0.9 },
  { code: 'IL', name: 'Israel', maleLE: 81, femaleLE: 84, travelFactor: 0.9, carFactor: 0.9, phoneFactor: 1.0, homeFactor: 0.85 },
  { code: 'IT', name: 'Italy', maleLE: 80, femaleLE: 85, travelFactor: 0.95, carFactor: 0.9, phoneFactor: 0.95, homeFactor: 0.75 },
  { code: 'JM', name: 'Jamaica', maleLE: 71, femaleLE: 76, travelFactor: 0.3, carFactor: 0.4, phoneFactor: 0.6, homeFactor: 0.55 },
  { code: 'JP', name: 'Japan', maleLE: 81, femaleLE: 87, travelFactor: 0.8, carFactor: 0.75, phoneFactor: 1.0, homeFactor: 0.75 },
  { code: 'JO', name: 'Jordan', maleLE: 73, femaleLE: 77, travelFactor: 0.35, carFactor: 0.55, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'KZ', name: 'Kazakhstan', maleLE: 68, femaleLE: 77, travelFactor: 0.35, carFactor: 0.65, phoneFactor: 0.7, homeFactor: 0.55 },
  { code: 'KE', name: 'Kenya', maleLE: 64, femaleLE: 69, travelFactor: 0.18, carFactor: 0.2, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'KR', name: 'South Korea', maleLE: 80, femaleLE: 86, travelFactor: 0.85, carFactor: 0.8, phoneFactor: 1.15, homeFactor: 0.75 },
  { code: 'KW', name: 'Kuwait', maleLE: 77, femaleLE: 81, travelFactor: 0.8, carFactor: 1.1, phoneFactor: 1.0, homeFactor: 0.75 },
  { code: 'LA', name: 'Laos', maleLE: 66, femaleLE: 70, travelFactor: 0.12, carFactor: 0.18, phoneFactor: 0.45, homeFactor: 0.4 },
  { code: 'LV', name: 'Latvia', maleLE: 70, femaleLE: 80, travelFactor: 0.75, carFactor: 0.8, phoneFactor: 0.8, homeFactor: 0.6 },
  { code: 'LB', name: 'Lebanon', maleLE: 76, femaleLE: 80, travelFactor: 0.35, carFactor: 0.65, phoneFactor: 0.7, homeFactor: 0.6 },
  { code: 'LT', name: 'Lithuania', maleLE: 70, femaleLE: 80, travelFactor: 0.8, carFactor: 0.85, phoneFactor: 0.85, homeFactor: 0.6 },
  { code: 'LU', name: 'Luxembourg', maleLE: 80, femaleLE: 84, travelFactor: 1.35, carFactor: 1.05, phoneFactor: 1.05, homeFactor: 0.9 },
  { code: 'MT', name: 'Malta', maleLE: 80, femaleLE: 84, travelFactor: 1.05, carFactor: 0.85, phoneFactor: 0.95, homeFactor: 0.75 },
  { code: 'MY', name: 'Malaysia', maleLE: 73, femaleLE: 77, travelFactor: 0.55, carFactor: 0.75, phoneFactor: 0.8, homeFactor: 0.65 },
  { code: 'MX', name: 'Mexico', maleLE: 71, femaleLE: 77, travelFactor: 0.45, carFactor: 0.65, phoneFactor: 0.7, homeFactor: 0.6 },
  { code: 'MA', name: 'Morocco', maleLE: 74, femaleLE: 77, travelFactor: 0.35, carFactor: 0.45, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'MZ', name: 'Mozambique', maleLE: 58, femaleLE: 64, travelFactor: 0.1, carFactor: 0.12, phoneFactor: 0.35, homeFactor: 0.4 },
  { code: 'MM', name: 'Myanmar', maleLE: 64, femaleLE: 70, travelFactor: 0.12, carFactor: 0.18, phoneFactor: 0.4, homeFactor: 0.4 },
  { code: 'NA', name: 'Namibia', maleLE: 60, femaleLE: 66, travelFactor: 0.2, carFactor: 0.35, phoneFactor: 0.5, homeFactor: 0.45 },
  { code: 'NP', name: 'Nepal', maleLE: 69, femaleLE: 72, travelFactor: 0.15, carFactor: 0.15, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'NL', name: 'Netherlands', maleLE: 80, femaleLE: 83, travelFactor: 1.25, carFactor: 0.85, phoneFactor: 1.0, homeFactor: 0.85 },
  { code: 'NZ', name: 'New Zealand', maleLE: 80, femaleLE: 84, travelFactor: 1.2, carFactor: 1.15, phoneFactor: 1.0, homeFactor: 0.95 },
  { code: 'NG', name: 'Nigeria', maleLE: 62, femaleLE: 64, travelFactor: 0.15, carFactor: 0.2, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'NO', name: 'Norway', maleLE: 81, femaleLE: 84, travelFactor: 1.35, carFactor: 1.05, phoneFactor: 1.05, homeFactor: 0.9 },
  { code: 'OM', name: 'Oman', maleLE: 75, femaleLE: 79, travelFactor: 0.6, carFactor: 0.85, phoneFactor: 0.9, homeFactor: 0.65 },
  { code: 'PK', name: 'Pakistan', maleLE: 65, femaleLE: 67, travelFactor: 0.12, carFactor: 0.18, phoneFactor: 0.4, homeFactor: 0.4 },
  { code: 'PA', name: 'Panama', maleLE: 74, femaleLE: 80, travelFactor: 0.5, carFactor: 0.6, phoneFactor: 0.7, homeFactor: 0.6 },
  { code: 'PY', name: 'Paraguay', maleLE: 72, femaleLE: 78, travelFactor: 0.3, carFactor: 0.45, phoneFactor: 0.6, homeFactor: 0.55 },
  { code: 'PE', name: 'Peru', maleLE: 73, femaleLE: 78, travelFactor: 0.35, carFactor: 0.45, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'PH', name: 'Philippines', maleLE: 67, femaleLE: 75, travelFactor: 0.25, carFactor: 0.3, phoneFactor: 0.6, homeFactor: 0.5 },
  { code: 'PR', name: 'Puerto Rico', maleLE: 76, femaleLE: 83, travelFactor: 0.6, carFactor: 0.9, phoneFactor: 0.85, homeFactor: 0.7 },
  { code: 'PL', name: 'Poland', maleLE: 74, femaleLE: 82, travelFactor: 0.8, carFactor: 0.85, phoneFactor: 0.85, homeFactor: 0.65 },
  { code: 'PT', name: 'Portugal', maleLE: 78, femaleLE: 84, travelFactor: 0.9, carFactor: 0.85, phoneFactor: 0.9, homeFactor: 0.7 },
  { code: 'QA', name: 'Qatar', maleLE: 79, femaleLE: 83, travelFactor: 1.0, carFactor: 1.2, phoneFactor: 1.1, homeFactor: 0.75 },
  { code: 'RO', name: 'Romania', maleLE: 72, femaleLE: 79, travelFactor: 0.65, carFactor: 0.75, phoneFactor: 0.75, homeFactor: 0.6 },
  { code: 'RU', name: 'Russia', maleLE: 68, femaleLE: 78, travelFactor: 0.45, carFactor: 0.75, phoneFactor: 0.75, homeFactor: 0.6 },
  { code: 'SA', name: 'Saudi Arabia', maleLE: 75, femaleLE: 78, travelFactor: 0.7, carFactor: 1.0, phoneFactor: 0.95, homeFactor: 0.7 },
  { code: 'RS', name: 'Serbia', maleLE: 73, femaleLE: 78, travelFactor: 0.55, carFactor: 0.75, phoneFactor: 0.7, homeFactor: 0.6 },
  { code: 'SG', name: 'Singapore', maleLE: 81, femaleLE: 86, travelFactor: 1.15, carFactor: 0.25, phoneFactor: 1.15, homeFactor: 0.8 },
  { code: 'SK', name: 'Slovakia', maleLE: 74, femaleLE: 81, travelFactor: 0.8, carFactor: 0.85, phoneFactor: 0.8, homeFactor: 0.65 },
  { code: 'SI', name: 'Slovenia', maleLE: 78, femaleLE: 84, travelFactor: 0.95, carFactor: 0.9, phoneFactor: 0.85, homeFactor: 0.7 },
  { code: 'ZA', name: 'South Africa', maleLE: 61, femaleLE: 68, travelFactor: 0.35, carFactor: 0.55, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'ES', name: 'Spain', maleLE: 80, femaleLE: 86, travelFactor: 1.0, carFactor: 0.85, phoneFactor: 0.95, homeFactor: 0.75 },
  { code: 'LK', name: 'Sri Lanka', maleLE: 73, femaleLE: 80, travelFactor: 0.2, carFactor: 0.3, phoneFactor: 0.55, homeFactor: 0.5 },
  { code: 'SE', name: 'Sweden', maleLE: 81, femaleLE: 85, travelFactor: 1.25, carFactor: 1.0, phoneFactor: 1.05, homeFactor: 0.9 },
  { code: 'CH', name: 'Switzerland', maleLE: 82, femaleLE: 86, travelFactor: 1.35, carFactor: 1.0, phoneFactor: 1.05, homeFactor: 0.9 },
  { code: 'TW', name: 'Taiwan', maleLE: 77, femaleLE: 83, travelFactor: 0.85, carFactor: 0.7, phoneFactor: 1.05, homeFactor: 0.75 },
  { code: 'TZ', name: 'Tanzania', maleLE: 64, femaleLE: 68, travelFactor: 0.12, carFactor: 0.15, phoneFactor: 0.4, homeFactor: 0.4 },
  { code: 'TH', name: 'Thailand', maleLE: 74, femaleLE: 80, travelFactor: 0.45, carFactor: 0.55, phoneFactor: 0.75, homeFactor: 0.6 },
  { code: 'TN', name: 'Tunisia', maleLE: 74, femaleLE: 77, travelFactor: 0.35, carFactor: 0.5, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'TT', name: 'Trinidad and Tobago', maleLE: 70, femaleLE: 76, travelFactor: 0.4, carFactor: 0.7, phoneFactor: 0.7, homeFactor: 0.6 },
  { code: 'TR', name: 'Turkey', maleLE: 75, femaleLE: 80, travelFactor: 0.55, carFactor: 0.8, phoneFactor: 0.8, homeFactor: 0.65 },
  { code: 'UG', name: 'Uganda', maleLE: 62, femaleLE: 67, travelFactor: 0.12, carFactor: 0.15, phoneFactor: 0.4, homeFactor: 0.4 },
  { code: 'UA', name: 'Ukraine', maleLE: 67, femaleLE: 77, travelFactor: 0.35, carFactor: 0.65, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'AE', name: 'United Arab Emirates', maleLE: 77, femaleLE: 79, travelFactor: 1.0, carFactor: 1.1, phoneFactor: 1.1, homeFactor: 0.75 },
  { code: 'GB', name: 'United Kingdom', maleLE: 79, femaleLE: 83, travelFactor: 1.15, carFactor: 1.0, phoneFactor: 1.0, homeFactor: 0.9 },
  { code: 'US', name: 'United States', maleLE: 76, femaleLE: 81, travelFactor: 0.9, carFactor: 1.35, phoneFactor: 1.1, homeFactor: 1.1 },
  { code: 'UY', name: 'Uruguay', maleLE: 74, femaleLE: 81, travelFactor: 0.55, carFactor: 0.75, phoneFactor: 0.75, homeFactor: 0.65 },
  { code: 'UZ', name: 'Uzbekistan', maleLE: 69, femaleLE: 74, travelFactor: 0.18, carFactor: 0.35, phoneFactor: 0.55, homeFactor: 0.45 },
  { code: 'VE', name: 'Venezuela', maleLE: 68, femaleLE: 76, travelFactor: 0.25, carFactor: 0.55, phoneFactor: 0.55, homeFactor: 0.5 },
  { code: 'VN', name: 'Vietnam', maleLE: 71, femaleLE: 79, travelFactor: 0.25, carFactor: 0.3, phoneFactor: 0.65, homeFactor: 0.5 },
  { code: 'ZM', name: 'Zambia', maleLE: 60, femaleLE: 66, travelFactor: 0.12, carFactor: 0.15, phoneFactor: 0.35, homeFactor: 0.4 },
  { code: 'ZW', name: 'Zimbabwe', maleLE: 59, femaleLE: 65, travelFactor: 0.12, carFactor: 0.15, phoneFactor: 0.35, homeFactor: 0.4 },
  { code: 'BH', name: 'Bahrain', maleLE: 79, femaleLE: 82, travelFactor: 0.85, carFactor: 1.0, phoneFactor: 1.0, homeFactor: 0.75 },
  { code: 'BW', name: 'Botswana', maleLE: 64, femaleLE: 70, travelFactor: 0.25, carFactor: 0.45, phoneFactor: 0.55, homeFactor: 0.5 },
  { code: 'CD', name: 'Democratic Republic of the Congo', maleLE: 60, femaleLE: 64, travelFactor: 0.1, carFactor: 0.12, phoneFactor: 0.35, homeFactor: 0.4 },
  { code: 'CY', name: 'Cyprus', maleLE: 80, femaleLE: 84, travelFactor: 0.9, carFactor: 0.85, phoneFactor: 0.9, homeFactor: 0.75 },
  { code: 'HT', name: 'Haiti', maleLE: 62, femaleLE: 68, travelFactor: 0.12, carFactor: 0.18, phoneFactor: 0.4, homeFactor: 0.4 },
  { code: 'LY', name: 'Libya', maleLE: 70, femaleLE: 76, travelFactor: 0.25, carFactor: 0.55, phoneFactor: 0.6, homeFactor: 0.5 },
  { code: 'MD', name: 'Moldova', maleLE: 67, femaleLE: 76, travelFactor: 0.35, carFactor: 0.55, phoneFactor: 0.6, homeFactor: 0.5 },
  { code: 'ME', name: 'Montenegro', maleLE: 74, femaleLE: 79, travelFactor: 0.6, carFactor: 0.7, phoneFactor: 0.7, homeFactor: 0.6 },
  { code: 'MK', name: 'North Macedonia', maleLE: 73, femaleLE: 78, travelFactor: 0.5, carFactor: 0.65, phoneFactor: 0.65, homeFactor: 0.55 },
  { code: 'NI', name: 'Nicaragua', maleLE: 70, femaleLE: 76, travelFactor: 0.22, carFactor: 0.3, phoneFactor: 0.5, homeFactor: 0.45 },
  { code: 'KP', name: 'North Korea', maleLE: 69, femaleLE: 76, travelFactor: 0.05, carFactor: 0.15, phoneFactor: 0.25, homeFactor: 0.35 },
  { code: 'PS', name: 'Palestine', maleLE: 72, femaleLE: 76, travelFactor: 0.2, carFactor: 0.35, phoneFactor: 0.55, homeFactor: 0.45 },
  { code: 'RW', name: 'Rwanda', maleLE: 66, femaleLE: 71, travelFactor: 0.15, carFactor: 0.18, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'SN', name: 'Senegal', maleLE: 66, femaleLE: 70, travelFactor: 0.18, carFactor: 0.22, phoneFactor: 0.45, homeFactor: 0.45 },
  { code: 'SO', name: 'Somalia', maleLE: 55, femaleLE: 60, travelFactor: 0.08, carFactor: 0.1, phoneFactor: 0.3, homeFactor: 0.35 },
  { code: 'SD', name: 'Sudan', maleLE: 64, femaleLE: 68, travelFactor: 0.12, carFactor: 0.18, phoneFactor: 0.4, homeFactor: 0.4 },
  { code: 'SS', name: 'South Sudan', maleLE: 55, femaleLE: 59, travelFactor: 0.06, carFactor: 0.08, phoneFactor: 0.25, homeFactor: 0.35 },
  { code: 'SY', name: 'Syria', maleLE: 69, femaleLE: 75, travelFactor: 0.12, carFactor: 0.35, phoneFactor: 0.45, homeFactor: 0.4 },
  { code: 'YE', name: 'Yemen', maleLE: 63, femaleLE: 67, travelFactor: 0.08, carFactor: 0.12, phoneFactor: 0.3, homeFactor: 0.35 },
  { code: 'OTHER', name: 'Other', maleLE: 71, femaleLE: 75, travelFactor: 0.5, carFactor: 0.6, phoneFactor: 0.7, homeFactor: 0.6 },
];

export const COUNTRIES = [...COUNTRY_ROWS].sort((a, b) => a.name.localeCompare(b.name));


export function getLifeExpectancySourceText(): string {
  return `${LIFE_EXPECTANCY_DISCLAIMER}\n\nSources:\n${LIFE_EXPECTANCY_SOURCES.map((s) => `- ${s.name}: ${s.url}`).join('\n')}`;
}

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
