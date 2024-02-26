import { useState, useEffect, useRef } from 'react';
import { Container } from '@mui/material';
import { UIBackground, ChartXY, AxisTickStrategies, emptyLine, emptyFill } from '@arction/lcjs';
import Papa from 'papaparse';
import { createChart } from '../../components/ChartHelper';
import { CountryData } from '../../utilities/definitions';
import '../../styles/controls-container.css';

const BubbleChart = () => {
  const [chart, setChart] = useState<ChartXY<UIBackground> | undefined>(undefined);
  const [chartData, setChartData] = useState<CountryData[]>([]);

  useEffect(() => {
    const licenseKey = process.env.REACT_APP_LIGHTNINGCHART_LICENSE_KEY;

    if (licenseKey) {
      const chart = createChart(licenseKey, 'chart-container');
      chart.setTitle('Bubble Chart');
      setChart(chart);

      return () => {
        if (chart) {
          chart.dispose();
        }
      };
    } else {
      console.error('LightningChart license key is undefined or chart container is null.');
    }
  }, []);

  //   useEffect(() => {
  //     if (chart) {
  //       chart
  //         .addPointLineAreaSeries({ dataPattern: null, sizes: true })
  //         .setStrokeStyle(emptyLine)
  //         .setAreaFillStyle(emptyFill)
  //         .appendSamples({
  //           xValues: [4, 2, 6],
  //           yValues: [5, 2, 8],
  //           sizes: [10, 25, 5],
  //         });
  //     }
  //   }, [chart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/hospitalizations/covid-hospitalizations.csv'
        );

        Papa.parse(await response.text(), {
          header: true,
          complete: (result: CountryData) => {
            setChartData(result.data || []);
          },
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
    console.log();
  }, []);

  useEffect(() => {
    if (chart) {
      const series = chart.addPointLineAreaSeries();
      series.setPointSize(10);
      series.add(
        chartData.map((entry) => ({
          x: entry.icu_patients_per_million,
          y: entry.icu_patients_per_million,
          size: 10,
        }))
      );
    }
  });

  return (
    <Container>
      <div
        id='chart-container'
        className='chart-container'
      />
    </Container>
  );
};

export default BubbleChart;
