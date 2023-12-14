import { lightningChart } from "@arction/lcjs";

import "../../charts.css";

export const createChart = (licenseKey: string, container: "chart-container") => {
  const lc = lightningChart({
    license: licenseKey,
    licenseInformation: {
      appTitle: "LightningChart JS Trial",
      company: "LightningChart Ltd.",
    },
  });

  const chart = lc.ChartXY({ container });

  return chart;
};
