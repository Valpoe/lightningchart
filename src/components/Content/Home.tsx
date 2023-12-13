import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  lightningChart,
  UIBackground,
  ChartXY,
  AxisTickStrategies,
} from "@arction/lcjs";
import Papa from "papaparse";
import { OutlinedInput } from "@mui/material";

interface CountryData {
  iso_code: string;
  date: string;
  icu_patients_per_million: number;
}

const Home = () => {
  const [startDate, setStartDate] = useState("2020-03-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["USA"]);
  const [chartData, setChartData] = useState<CountryData[]>([]);
  const [chart, setChart] = useState<ChartXY<UIBackground> | undefined>(
    undefined
  );
  const [isoCodes, setIsoCodes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

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
            // Extract unique ISO codes from the parsed data
            const availableIsoCodes = Array.from(
              new Set(result.data.map((row: any) => row.iso_code))
            );

            // Populate the isoCodes state with unique ISO codes
            setIsoCodes(availableIsoCodes as string[]);

            // Extract unique locations from the parsed data
            const availableLocations = Array.from(
              new Set(result.data.map((row: any) => row.entity))
            );

            // Populate the locations state with unique locations
            setLocations(availableLocations as string[]);

            const newData: CountryData[] = result.data
              .filter(
                (row: any) =>
                  row.indicator === "Daily ICU occupancy per million"
              )
              .map((row: any) => ({
                iso_code: row.iso_code || "",
                date: row.date || "",
                icu_patients_per_million: parseFloat(row.value || "0"),
              }));

            // Set the chart data state
            setChartData(newData);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    if(chart) {
      chart.dispose();
    }
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

    // Configure the X-axis as a DateTime Axis
    const xAxis = newChart.getDefaultAxisX();
    xAxis.setTickStrategy(AxisTickStrategies.DateTime);
    xAxis.setInterval({
      // Set the date range
      start: new Date(startDate).getTime(),
      end: new Date(endDate).getTime(),
    });

    setChart(newChart);

    return () => {
      if (newChart) {
        newChart.dispose();
      }
    };
  }, [startDate, endDate]);

  useEffect(() => {
    if (chart && chartData.length > 0) {
      // Clear data of existing series
      chart.getSeries().forEach((series) => series.dispose());

      // Create a line series for each selected country
      selectedCountries.forEach((country) => {
        const countrySeries = chart.addLineSeries();
        const countryData = chartData
          .filter((data) => data.iso_code === country)
          .filter(
            (data) =>
              new Date(data.date).getTime() >= new Date(startDate).getTime() &&
              new Date(data.date).getTime() <= new Date(endDate).getTime()
          );

        console.log("Country Data:", countryData);
        const seriesData = countryData
          .filter((data) => !isNaN(new Date(data.date).getTime()))
          .map((data) => ({
            x: new Date(data.date).getTime(),
            y: data.icu_patients_per_million,
          }));
        // Check if there are enough data points for a line series
        if (seriesData.length > 1) {
          countrySeries.add(seriesData);
        }
      });
    }
  }, [chart, chartData, selectedCountries, startDate, endDate]);

  const isoCodeLocationPairs = isoCodes.map((isoCode, index) => ({
    isoCode,
    location: locations[index],
    key: isoCode || index.toString(), // Use isoCode or index as the key
  }));

  return (
    <Container>
      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <FormControl sx={{ width: 300 }}>
          <InputLabel>Select Countries</InputLabel>
          <Select
            multiple
            value={selectedCountries}
            onChange={(e) => setSelectedCountries(e.target.value as string[])}
            input={<OutlinedInput label="Select Countries" />}
          >
            {isoCodeLocationPairs.map(({ isoCode, location, key }) => (
              <MenuItem key={key} value={isoCode}>
                {isoCode} - {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div id="chart-container" style={{ width: "100%", height: "100%" }}></div>
    </Container>
  );
};

export default Home;
