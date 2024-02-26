import { lightningChart } from '@arction/lcjs';
import { myCustomTheme } from '../utilities/definitions';

import '../styles/chart-container.css';

export const createChart = (
  licenseKey: string,
  container: 'chart-container',
) => {
  const lc = lightningChart({
    license: licenseKey,
    licenseInformation: {
      appTitle: 'LightningChart JS',
      company: 'LightningChart Ltd.',
    },
  });

  const chart = lc.ChartXY({ container, theme: myCustomTheme});
  return chart;
};

export const createBarChart = (
  licenseKey: string,
  container: 'chart-container',
  theme: string,
) => {
  const lc = lightningChart({
    license: licenseKey,
    licenseInformation: {
      appTitle: 'LightningChart JS',
      company: 'LightningChart Ltd.',
    },
  });

  const chart = lc.BarChart({ container, theme: myCustomTheme });
  return chart;
};
