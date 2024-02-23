export const ThemeOptions = [
  {
    name: 'Dark Gold',
    theme: 'darkGold',
  },
  {
    name: 'Light',
    theme: 'light',
  },
  {
    name: 'Cyber Space',
    theme: 'cyberSpace',
  },
  {
    name: 'Turquoise Hexagon',
    theme: 'turquoiseHexagon',
  },
];

export const colorOptions = [
  {
    name: 'Green',
    color: '#008a00',
  },
  {
    name: 'Blue',
    color: '#00008a',
  },
  {
    name: 'Red',
    color: '#8a0000',
  },
];

export type ConsumptionData = {
  Date: Date;
  Global_active_power: string;
};

export type CountryData = {
  iso_code: string;
  date: string;
  icu_patients_per_million: number;
  indicator?: string;
  entity?: string;
  value?: string;
  data?: [];
  locations?: string[];
  isoCodes?: string[];
};

export type CountryDataTotal = {
  iso_code: string;
  location: string;
  total_icu_patients: number;
  indicator?: string;
  entity?: string;
  value?: string;
  data?: [];
};
