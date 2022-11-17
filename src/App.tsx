import React from "react";
import "./App.css";
//Components
import TypeWriter from "./Components/TypeWriter/TypeWriter";
import Header from "./Components/Header/Header";
import Graph from "./Components/TypeWriter/Graph/Graph";
// import refresh from "./Icons/refresh.svg";
import { ReactComponent as Refresh } from "./Icons/rotate-cw.svg";
//Types
import { Data, createEmptyData } from "./Components/TypeWriter/TypeWriter";

function App() {
  const [refresh, set_Refresh] = React.useState(false);
  const [data, set_Data] = React.useState(createEmptyData());

  return (
    <div className="App">
      <div className="mainContainer">
        <div className="subContainer1">
          <Header />
        </div>
        <div className="subContainer2">
          <TypeWriter
            refresh={refresh}
            set_Refresh={set_Refresh}
            set_Data={set_Data}
          />
          <div
            className="refresh-icon"
            tabIndex={0}
            onClick={() => set_Refresh(true)}
            onKeyUpCapture={(e) => {
              e.key === "Enter" && set_Refresh(true);
            }}
          >
            <Refresh />
          </div>
          <div className="subContainer3">
            <Graph data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
