import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { UIBackground, ChartXY, emptyLine, emptyFill } from '@arction/lcjs';
import { createChart } from '../../components/ChartHelper';
import '../../styles/controls-container.css';

const BubbleChart = () => {
  const [chart, setChart] = useState<ChartXY<UIBackground> | undefined>(undefined);
  const [chartData, setChartData] = useState<Array<{ x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const licenseKey = process.env.REACT_APP_LIGHTNINGCHART_LICENSE_KEY;

    if (licenseKey) {
      const fetchData = async () => {
        const numPoints = 100;
        const generatedData = [];

        for (let i = 0; i < numPoints; i++) {
          const x = Math.random() * 10;
          const y = Math.random() * 10;
          const size = Math.random() * 30;

          generatedData.push({ x, y, size });
        }

        setChartData(generatedData);

        const chart = createChart(licenseKey, 'chart-container');
        chart.setTitle('Bubble Chart');
        setChart(chart);

        return () => {
          if (chart) {
            chart.dispose();
          }
        };
      };

      fetchData();
    } else {
      console.error('LightningChart license key is undefined or chart container is null.');
    }
  }, []);

  useEffect(() => {
    if (chart) {
      chart
        .addPointLineAreaSeries({ dataPattern: null, sizes: true })
        .setStrokeStyle(emptyLine)
        .setAreaFillStyle(emptyFill)
        .appendSamples({
          xValues: chartData.map((d) => d.x),
          yValues: chartData.map((d) => d.y),
          sizes: chartData.map((d) => d.size),
        });
    }
  }, [chart, chartData]);

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
