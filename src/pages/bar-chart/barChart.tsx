import React, { useEffect, useId, useState } from 'react';
import {
  lightningChart,
  BarChartTypes,
  BarChartSorting,
  SolidFill,
  Themes,
} from '@arction/lcjs';

import data from '../../data/power-consumption.json';

interface ElectricityData {
  Date: string;
  Global_active_power: string;
}

const BarChart = () => {
  const id = useId();
  const [chartData, setChartData] = useState<ElectricityData[]>([]);
  const [barChart, setBarChart] = useState<any>(undefined);

  useEffect(() => {
    setChartData(data as ElectricityData[]);
  }, []);

  useEffect(() => {
    const licenseKey = process.env.REACT_APP_LIGHTNINGCHART_LICENSE_KEY;
    const container = document.getElementById(id) as HTMLDivElement;

    if (licenseKey) {
      const lc = lightningChart({ license: licenseKey });
      const barChart = lc
        .BarChart({
          type: BarChartTypes.Vertical,
          theme: Themes.darkGold,
          container,
        })
        .setSorting(BarChartSorting.None);
      barChart.setTitle('Global Active Power Consumption');
      barChart.valueAxis.setTitle('Global Active Power (kW)');
      setBarChart(barChart);

      return () => {
        if (barChart) barChart.dispose();
      };
    } else {
      console.error('LightningChart license key is undefined');
    }
  }, [id]);

  useEffect(() => {
    if (chartData.length === 0 || !barChart) return;

    const mappedData = chartData.map((entry) => ({
      category: entry.Date,
      value: parseFloat(entry.Global_active_power),
    }));

    barChart.setData(mappedData);

    const theme = Themes.darkGold;

    barChart.getBars().forEach((bar: any) =>
      bar.setFillStyle(
        new SolidFill({
          color:
            bar.value > 0
              ? theme.examples.badGoodColorPalette[0]
              : theme.examples.badGoodColorPalette[
                  theme.examples?.badGoodColorPalette.length - 1
                ],
        }),
      ),
    );
  }, [id, chartData, barChart]);

  return (
    <div>
      <h1>Bar Chart</h1>
      <div
        id={id}
        className='chart-container'
      ></div>
    </div>
  );
};

export default BarChart;
