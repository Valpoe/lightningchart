import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  lightningChart,
  UIBackground,
  ChartXY,
  AxisTickStrategies,
  LegendBoxBuilders,
  LineSeries,
} from "@arction/lcjs";
import Papa from "papaparse";
import { Typography } from "@mui/material";

interface CountryData {
  iso_code: string;
  date: string;
  icu_patients_per_million: number;
}

const Home = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
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
  }, []);

  useEffect(() => {
    if (chart) {
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
    newChart.getDefaultAxisX()
      .setTickStrategy(AxisTickStrategies.DateTime);

    newChart.getDefaultAxisY()
      .setTitle("ICU Patients / Million")

    // Set the chart title
    newChart.setTitle("ICU Patients");
  
    setChart(newChart);

    return () => {
      if (newChart) {
        newChart.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (chart && chartData.length > 0) {
      // Clear data of existing series
      chart.getSeries().forEach((series) => series.dispose());

      // Create a line series for each selected country
      selectedCountries.forEach((country) => {
        const countrySeries = chart.addLineSeries();
        const countryData = chartData
          .filter(
            (data) =>
              data.iso_code === country &&
              new Date(data.date).getTime() >=
                new Date(startDate).getTime() &&
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
      }
      );
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
        <FormControl>
          <Typography>Start Date</Typography>
          <TextField
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Typography>End Date</Typography>
          <TextField
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <Typography>Select Countries</Typography>
          <Select
            multiple
            value={selectedCountries}
            onChange={(e) => setSelectedCountries(e.target.value as string[])}
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
