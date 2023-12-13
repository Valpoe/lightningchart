import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import {
  lightningChart,
  UIBackground,
  ChartXY,
  AxisTickStrategies,
  UIElementBuilders,
} from "@arction/lcjs";
import Papa from "papaparse";

interface CountryData {
  iso_code: string;
  location: string;
  total_icu_patients: number;
}

const Charts = () => {
  const [chartData, setChartData] = useState<CountryData[]>([]);
  const [chart, setChart] = useState<ChartXY<UIBackground> | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      const test = await fetch(
        "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/hospitalizations/covid-hospitalizations.csv"
      );
      
      const testData = await test.text();
      console.log(testData);
    }
    fetchData();
  }
  , []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/hospitalizations/covid-hospitalizations.csv"
        );

        // Parse CSV data using papaparse
        Papa.parse(await response.text(), {
          header: true,
          complete: (result: any) => {
            // Aggregate the data by country
            const countryDataMap: { [isoCode: string]: CountryData } = {};

            result.data.forEach((row: any) => {
              const isoCode = row.iso_code || "";
              const location = row.entity || "";
              const indicator = row.indicator || "";
              const value = parseFloat(row.value || "0");

              if (indicator === "Weekly new ICU admissions") {
                if (!(isoCode in countryDataMap)) {
                  countryDataMap[isoCode] = {
                    iso_code: isoCode,
                    location: location,
                    total_icu_patients: 0,
                  };
                }

                countryDataMap[isoCode].total_icu_patients += value;
              }
            });

            // Convert the aggregated map to an array
            const countryData: CountryData[] = Object.values(countryDataMap);

            // Sort the array based on total_icu_patients in descending order
            const sortedData = countryData.sort(
              (a, b) => b.total_icu_patients - a.total_icu_patients
            );

            // Get the top 10 countries
            const top10Data = sortedData.slice(0, 10);

            // Set the chart data state
            setChartData(top10Data);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chart && chartData.length > 0) {
      // Dispose of existing series
      chart.getSeries().forEach((series) => series.dispose());

      // Create a series for the bars
      const barSeries = chart.addRectangleSeries();

      // Add data points to the bar series
      chartData.forEach((data, index) => {
        const barWidth = 0.8;
        const barHeight = data.total_icu_patients;

        // Position the rectangle based on the index and data value
        barSeries.add({
          x: index,
          y: 0,
          width: barWidth,
          height: barHeight,
        });
      });
      // Adjust the y-axis range to be higher than the highest bar height
const maxBarHeight = Math.max(...chartData.map((data) => data.total_icu_patients));
chart.getDefaultAxisY().setInterval({ start: 0, end: maxBarHeight + 100000 });

    }
  }, [chart, chartData]);

  useEffect(() => {
    if (chart) {
      // Configure the X-axis
      const xAxis = chart.getDefaultAxisX()
        .setMouseInteractions(false) // Disable mouse interactions
        .setScrollStrategy(undefined) // Disable zooming
        .setTickStrategy(AxisTickStrategies.Empty); // Disable default ticks

      // Add custom tick labels as locations from the chart data
      const tickLabels = chartData.map((data) => data.location);

      // Add the tick labels to the X-axis
      tickLabels.forEach((label, index) => {
        xAxis
          .addCustomTick(UIElementBuilders.AxisTickMajor)
          .setValue(index + 0.4)
          .setTextFormatter(() => label)
          .setGridStrokeLength(0)
          .setMouseInteractions(false);
      });

      // Configure the Y-axis label
      chart.getDefaultAxisY()
        .setMouseInteractions(false) // Disable mouse interactions
        .setScrollStrategy(undefined) // Enable scrolling
        .setTitle("Total ICU patients"); // Set the Y-axis title

      // Set the chart title
      chart.setTitle("Top 10 Countries All Time");
    }
  }, [chart, chartData]);

  useEffect(() => {
    // Initialize the chart when the component mounts
    const newChart = lightningChart({
      license: process.env.REACT_APP_LIGHTNINGCHART_LICENSE_KEY,
      licenseInformation: {
        appTitle: "LightningChart JS Trial",
        company: "LightningChart Ltd.",
      },
    }).ChartXY({
      width: 1200,
      height: 600,
      container: "chart-container",
    });

    setChart(newChart);

    // Clean up the chart when the component unmounts
    return () => {
      if (newChart) {
        newChart.dispose();
      }
    };
  }, []);

  return (
    <Container>
      <div
        id="chart-container"
        style={{ width: "100%", height: "100%" }}
      ></div>
    </Container>
  );
};

export default Charts;
