import React, { useEffect, useId, useState } from 'react';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { Button } from '@mui/material';
import {
  lightningChart,
  BarChartTypes,
  BarChartSorting,
  SolidFill,
  Themes,
  BarChart,
  BarChartBar,
  ColorHEX,
} from '@arction/lcjs';
import {
  parse,
  isWithinInterval,
  eachDayOfInterval,
  format,
  formatDate,
  set,
} from 'date-fns';
import data from '../../data/power-consumption.json';
import { ThemeOptions, ConsumptionData } from '../../utilities/definitions';
import { createBarChart } from '../../components/ChartHelper';

import '../../styles/controls-container.css';

const BarChartComp = () => {
  const id = useId();
  const [chartData, setChartData] = useState<ConsumptionData[]>([]);
  const [barChart, setBarChart] = useState<BarChart | undefined>(undefined);
  const [startDate, setStartDate] = useState('01/01/2007');
  const [endDate, setEndDate] = useState('07/01/2007');
  const [selectedTheme, setSelectedTheme] = useState('darkGold');

  useEffect(() => {
    if (Array.isArray(data)) {
      const formattedChartData = data.map((entry) => ({
        ...entry,
        Date: parse(entry.Date, 'd/M/yyyy', new Date()),
      }));

      setChartData(formattedChartData);
    }
  }, []);
  console.log('chartData: ', chartData);

  useEffect(() => {
    const licenseKey = process.env.REACT_APP_LIGHTNINGCHART_LICENSE_KEY;
    // const container = document.getElementById(id) as HTMLDivElement;

    if (licenseKey) {
      const barChart = createBarChart(licenseKey, 'chart-container', selectedTheme);
      barChart.setSorting(BarChartSorting.None);
      // const barChart = lc
      //   .BarChart({
      //     type: BarChartTypes.Vertical,
      //     theme: Themes[selectedTheme as keyof typeof Themes],
      //     container,
      //   })
      //   .setSorting(BarChartSorting.None);
      barChart.setTitle('Global Active Power Consumption');
      barChart.valueAxis.setTitle('Global Active Power (kW)');
      barChart.setCategoryLabels({
        labelFillStyle: new SolidFill({ color: ColorHEX('#feffba')})
      })
      barChart.setValueLabels({ 
        position: 'inside-bar-centered',
        formatter: (bar, category, value) => `${value.toFixed(2)} kW`,
      })
      // barChart.setSeriesBackgroundFillStyle(new SolidFill({ color: ColorHEX('#2b2b2b') }));
      setBarChart(barChart);

      return () => {
        if (barChart) barChart.dispose();
      };
    } else {
      console.error('LightningChart license key is undefined');
    }
  }, [id, selectedTheme]);

  console.log('selectedTheme: ', selectedTheme);

  useEffect(() => {
    if (chartData.length === 0 || !barChart) return;

    // Sum the global active power for each day
    // const aggregatedData = chartData.reduce((result, entry) => {
    //   const date = entry.Date;
    //   if (result[date]) {
    //     result[date] += parseFloat(entry.Global_active_power);
    //   } else {
    //     result[date] = parseFloat(entry.Global_active_power);
    //   }
    //   return result;
    // }, {} as { [key: string]: number });

    const aggregatedData = chartData.reduce((result, entry) => {
      const date = formatDate(entry.Date, 'dd/MM/yyyy');
      if (result[date]) {
        result[date] += parseFloat(entry.Global_active_power);
      } else {
        result[date] = parseFloat(entry.Global_active_power);
      }
      return result;
    }, {} as { [key: string]: number });

    console.log('aggregatedData: ', aggregatedData);

    const allDates = Object.keys(aggregatedData);
    // Sort the dates to ensure correct ordering
    const sortedDates = allDates.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    console.log('sortedDates: ', sortedDates);

    // Find the index of the startDate in the sortedDates
    const startIndex = sortedDates.findIndex(
      (date) => new Date(date).getTime() >= new Date(startDate).getTime(),
    );

    // Get the first 7 days from the startIndex
    const filteredDates = sortedDates.slice(startIndex, startIndex + 7);

    // Now use the filtered dates to get the corresponding data
    const filteredData: Array<[string, number]> = filteredDates.map((date) => [
      date,
      aggregatedData[date],
    ]);

    console.log('filteredData: ', filteredData);

    const mappedData = filteredData.map(([date, value]) => ({
      category: date,
      value: value,
    }));

    barChart.setData(mappedData);

    const theme = Themes.lightNature;

    barChart.getBars().forEach((bar: BarChartBar) =>
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
  }, [id, chartData, barChart, startDate, endDate]);

  const addWeek = (dateString: string) => {
    const [day, month, year] = dateString.split('/');

    // Convert day, month, and year to numbers
    const currentDay = parseInt(day, 10);
    const currentMonth = parseInt(month, 10);
    const currentYear = parseInt(year, 10);

    // Create a Date object with the current date
    const currentDate = new Date(currentYear, currentMonth - 1, currentDay);

    // Add 7 days to the current date
    const newDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get the components of the new date
    const newDay = newDate.getDate();
    const newMonth = newDate.getMonth() + 1;
    const newYear = newDate.getFullYear();

    // Format the components as strings with leading zeros if necessary
    const formattedDay = String(newDay).padStart(2, '0');
    const formattedMonth = String(newMonth).padStart(2, '0');
    const formattedYear = String(newYear);

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };
  const handleWeekChange = () => {
    const start = startDate;
    const end = endDate;

    const newStartDate = addWeek(start);
    const newEndDate = addWeek(end);

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    console.log('newStartDate: ', newStartDate);
    console.log('newEndDate: ', newEndDate);
    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);
  };

  return (
    <Container>
      <div className='controls-container'>
        <FormControl sx={{ width: 300 }}>
          <Select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as any)}
            renderValue={(selected) => {
              const selectedThemeOption = ThemeOptions.find(
                (option) => option.theme === selected,
              );
              return selectedThemeOption
                ? `Theme: ${selectedThemeOption.name}`
                : '';
            }}
          >
            {ThemeOptions.map((option) => (
              <MenuItem
                key={option.theme}
                value={option.theme}
              >
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 150 }}>
          <Button
            variant='outlined'
            onClick={handleWeekChange}
          >
            Next Week
          </Button>
        </FormControl>
      </div>
      <div
        id='chart-container'
        className='chart-container'
      ></div>
    </Container>
  );
};

export default BarChartComp;
