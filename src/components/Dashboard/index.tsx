import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

import './style.css';

export interface DashboardProps {
  coordinateValues: { x: number, y: number }[]
}

export const Dashboard = ({coordinateValues}: DashboardProps) => {
  const options: ApexOptions = {
    colors: ["#12AAFF", "#002d47"],

    xaxis: {
      tickAmount: 24,
    },

    yaxis: [
      {
        seriesName: "Temperatura",
        title: {
          text: "Temperatura",
        },
      },
    ],
  };

  const series = [
    {
      name: "Temperatura",
      type: "line",
      data: coordinateValues,
    },
  ]


  return (
    <div className="chart-container">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        width={"400%"}
        height={"80%"}
      />
    </div>
  );
}
