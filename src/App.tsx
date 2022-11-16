import React from "react";
import "./App.css";
//Components
import TypeWriter from "./Components/TypeWriter/TypeWriter";
import Header from "./Components/Header/Header";
//Icons
// import refresh from "./Icons/refresh.svg";
import { ReactComponent as Refresh } from "./Icons/rotate-cw.svg";

function App() {
  const [refresh, set_Refresh] = React.useState(false);

  return (
    <div className="App">
      <div className="mainContainer">
        <div className="subContainer1">
          <Header />
        </div>
        <div className="subContainer2">
          <TypeWriter refresh={refresh} set_Refresh={set_Refresh} />
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
          <div className="subContainer3"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
