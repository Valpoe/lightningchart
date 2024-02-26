import { ColorHEX } from '@arction/lcjs';
import { makeFlatTheme } from '@arction/lcjs-themes';

  export const myCustomTheme = makeFlatTheme({
    isDark: true,
    fontFamily: "Segoe UI, -apple-system, Verdana, Helvetica",
    backgroundColor: ColorHEX("#181818ff"),
    textColor: ColorHEX("#ffffc8ff"),
    dataColors: [ColorHEX("#ffff5b"), ColorHEX("#ffcd5b"), ColorHEX("#ff9b5b"), ColorHEX("#ffc4bc"), ColorHEX("#ff94b8"), ColorHEX("#db94c6"), ColorHEX("#ebc4e0"), ColorHEX("#a994c6"), ColorHEX("#94e2c6"), ColorHEX("#94ffb0"), ColorHEX("#b4ffa5")],
    axisColor: ColorHEX("#00000000"),
    gridLineColor: ColorHEX("#303030ff"),
    uiBackgroundColor: ColorHEX("#161616ff"),
    uiBorderColor: ColorHEX("#ffffff"),
    dashboardSplitterColor: ColorHEX("#2d2d2dff"),
})

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
