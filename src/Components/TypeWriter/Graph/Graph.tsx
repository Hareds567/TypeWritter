import React, { SetStateAction } from "react";
//Chart
import Chart, { ChartItem, ChartData } from "chart.js/auto";
import { Data, PostData } from "../../../Components/TypeWriter/TypeWriter";
//css
import "./Graph.css";
//Icons

//
import { Text } from "../../../Texts/Texts";
//Components
import GraphMenu from "./GraphMenu/GraphMenu";
import MoreStats from "./MoreStats/MoreStats";
import Stats from "./Stats/Stats";
import Replay from "./Replay/Replay";
//
import { Word } from "../../../Classes/Word";
interface Props {
  data: Data;
  obj: Text;
  nextText: any;
  repeatTest: any;
  content: Word[];
  getTestType: () => string;
  set_currenLocation: React.Dispatch<SetStateAction<number>>;
  postData: PostData;
}

const Graph: React.FC<Props> = ({
  data,
  obj,
  nextText,
  repeatTest,
  getTestType,
  set_currenLocation,
  content,
  postData,
}) => {
  const chartDiv = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const data2: ChartData = {
      labels: data.labels.map((x) => x),
      datasets: [
        {
          label: "raw",
          type: "line",
          data: data.raw_wpm_Arr,
          fill: false,
          borderColor: "#646669",
          backgroundColor: "#646669",
        },
        {
          label: "wpm",
          type: "line",
          data: data.wpm_Arr,
          fill: false,
          borderColor: "#c2f970",
          backgroundColor: "#c2f970",
        },
        {
          label: "Errors",
          type: "scatter",
          data: data.err_Arr,
          fill: false,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgb(255, 99, 132)",
          yAxisID: "y2",
          order: 1,
        },
      ],
    };

    const chart = new Chart(chartDiv.current as ChartItem, {
      data: data2,
      type: "scatter",
      options: {
        hover: {
          mode: "index",
        },

        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            ticks: {
              stepSize: 2,
              padding: 0,
            },
            min: 1,
            max: data.totalTime,
          },
          y: {
            title: { display: true, text: "Words per Minute" },
            suggestedMin: 0,
            ticks: {
              stepSize: 40,
            },
          },
          y2: {
            title: { display: true, text: "Errors" },
            beginAtZero: true,
            position: "right",
            ticks: {
              stepSize: 1,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {},
          },
        },
      },
      plugins: [],
    });

    return () => {
      chart.destroy();
    };
  }, [data, set_currenLocation]);

  return (
    <div className="chart-container">
      <div className="chart-container-subContainer1">
        <div className={"stats"}>
          <Stats data={data} obj={obj} />
        </div>
        <div className={"moreStats"}>
          <MoreStats data={data} obj={obj} getTestType={getTestType} />
        </div>
        <div className={"chart"}>
          <canvas className="graph" ref={chartDiv} id={"chart"}></canvas>
        </div>
      </div>
      <div className={"graph-menu"}>
        <GraphMenu
          nextText={nextText}
          repeatText={repeatTest}
          set_currenLocation={set_currenLocation}
        />
      </div>
      <div className="replay">
        <Replay postData={postData} content={obj.content} />
      </div>
    </div>
  );
};

export default Graph;
