import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import { UIBackground, ChartXY, AxisTickStrategies } from "@arction/lcjs";
import Papa from "papaparse";
import { createChart } from "./ChartHelper";
import "../Styling/ControlsContainer.css";

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

            // Filter the data to only include ICU occupancy per million
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
        console.error("Error fetching or parsing data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Remove series if the country is not selected
    if (chart) {
      chart.getSeries().forEach((series) => {
        if (!selectedCountries.includes(series.getName())) {
          series.dispose();
        }
      });
    }
  }, [chart, selectedCountries]);

  useEffect(() => {
    if (chart && chartData.length > 0) {
      // Clear data of existing series
      chart.getSeries().forEach((series) => series.dispose());

      // Create a line series for each selected country
      selectedCountries.forEach((country) => {
        const countrySeries = chart.addLineSeries();
        const countryData = chartData.filter(
          (data) =>
            data.iso_code === country &&
            new Date(data.date).getTime() >= new Date(startDate).getTime() &&
            new Date(data.date).getTime() <= new Date(endDate).getTime()
        );
        console.log("line series: ", countrySeries);
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

  useEffect(() => {
    // Get the license key from the environment variable
    const licenseKey = process.env.REACT_APP_LIGHTNINGCHART_LICENSE_KEY;

    // Check if the license key is defined and chartContainerRef is available
    if (licenseKey) {
      // Initialize the chart when the component mounts
      const newChart = createChart(licenseKey, "chart-container");
      newChart
        .getDefaultAxisX()
        .setTickStrategy(AxisTickStrategies.DateTime)
        .setTitle("Date Range");
      newChart.getDefaultAxisY().setTitle("ICU Patients / Million");
      newChart.setTitle("ICU Patients / Million");
      setChart(newChart);

      // Clean up the chart when the component unmounts
      return () => {
        if (newChart) {
          newChart.dispose();
        }
      };
    } else {
      console.error(
        "LightningChart license key is undefined or chart container is null."
      );
    }
  }, []);

  // Create an array of objects containing the ISO code and location
  const isoCodeLocationPairs = isoCodes.map((isoCode, index) => ({
    isoCode,
    location: locations[index],
    key: isoCode || index.toString(),
  }));

  // Use a variable to store the label for the closed Select component
  const selectedCountriesLabel = `${selectedCountries.length} countries selected`;

  return (
    <Container>
      <div className="controls-container">
        <FormControl sx={{ width: 300 }}>
          <TextField
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {startDate ? "Start Date" : "Start Date"}
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <TextField
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {startDate ? "End Date" : "End Date"}
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <Select
            multiple
            value={selectedCountries}
            onChange={(e) => setSelectedCountries(e.target.value as string[])}
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Select countries</em>;
              }
              return selectedCountriesLabel;
            }}
          >
            {isoCodeLocationPairs.map((pair) => (
              <MenuItem key={pair.key} value={pair.isoCode}>
                {pair.isoCode} - {pair.location}
                {selectedCountries.includes(pair.isoCode) && (
                  <span style={{ marginLeft: "8px", color: "green" }}>✔</span>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div id="chart-container" className="chart-container"></div>
    </Container>
  );
};

export default Home;
