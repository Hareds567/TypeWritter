import React from "react";
//Chart
import Chart, { ChartItem, ChartData } from "chart.js/auto";
import { Data } from "../../../Components/TypeWriter/TypeWriter";

interface Props {
  data: Data;
}

const Graph: React.FC<Props> = ({ data }) => {
  const chartDiv = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const data2: ChartData = {
      labels: data.labels,
      datasets: [
        {
          label: "My First Dataset",
          data: data.raw_wpm_Arr,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    const chart = new Chart(chartDiv.current as ChartItem, {
      data: data2,
      type: "line",
      options: {},
      plugins: [],
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <div className="Chart-container">
      <canvas className="chart" ref={chartDiv} id={"chart"}></canvas>
    </div>
  );
};

export default Graph;
