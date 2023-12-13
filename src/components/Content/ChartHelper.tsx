// components/content/ChartHelper.tsx

import { lightningChart, Themes } from '@arction/lcjs';

export const createChart = (licenseKey: string) => {
  const lc = lightningChart({
    license: licenseKey,
    licenseInformation: {
      appTitle: 'LightningChart JS Trial',
      company: 'LightningChart Ltd.',
    },
  });

  // make the chart 600 x 400 px in size
    const chart = lc.ChartXY({ width: 600, height: 400, theme: Themes.light });

  return chart;
};