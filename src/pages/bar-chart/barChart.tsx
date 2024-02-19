import React, { useEffect, useId, useState } from 'react';
import Container from '@mui/material/Container';
import {
  lightningChart,
  BarChartTypes,
  BarChartSorting,
  SolidFill,
  Themes,
} from '@arction/lcjs';
import {
  parse,
  isWithinInterval,
  eachDayOfInterval,
  format,
  formatDate,
} from 'date-fns';
import data from '../../data/power-consumption.json';
import '../../styles/controls-container.css';

interface ElectricityData {
  Date: string;
  Global_active_power: string;
}

const normalizeDate = (dateString: string): string => {
  const parts = dateString.split('/');
  const day = parts[0];
  const month = parts[1];
  const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
  return `${day}/${month}/${year}`;
};

const BarChart = () => {
  const id = useId();
  const [chartData, setChartData] = useState<ElectricityData[]>([]);
  const [barChart, setBarChart] = useState<any>(undefined);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setChartData(data as ElectricityData[]);
  }, []);

  // useEffect(() => {
  //   setChartData(data as ElectricityData[]);
  //   chartData.forEach((entry) => {
  //     entry.Date = normalizeDate(entry.Date);
  //   });
  // }, [chartData]);

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

    // Sum the global active power for each day
    const aggregatedData = chartData.reduce((result, entry) => {
      const date = normalizeDate(entry.Date);
      if (result[date]) {
        result[date] += parseFloat(entry.Global_active_power);
      } else {
        result[date] = parseFloat(entry.Global_active_power);
      }
      return result;
    }, {} as { [key: string]: number });

    // Get the first week of the data
    const slicedData = Object.entries(aggregatedData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(0, 7);

    // set the start and end date
    setStartDate(slicedData[0][0]);
    setEndDate(slicedData[slicedData.length - 1][0]);

    const mappedData = slicedData.map(([date, value]) => ({
      category: date,
      value: value,
    }));

    barChart.setData(mappedData);

    const theme = Themes.darkGold;

    barChart.getBars().forEach((bar: any) =>
      bar.setFillStyle(
        new SolidFill({
          color:
            bar.value > 2500
              ? theme.examples.badGoodColorPalette[0]
              : theme.examples.badGoodColorPalette[
                  theme.examples?.badGoodColorPalette.length - 1
                ],
        }),
      ),
    );
  }, [id, chartData, barChart]);

  return (
    <Container>
      <div className='controls-container'>
        <div
          id={id}
          className='chart-container'
        ></div>
      </div>
    </Container>
  );
};

export default BarChart;
