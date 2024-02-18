import { lightningChart } from '@arction/lcjs';

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

  const chart = lc.ChartXY({ container });
  return chart;
};
