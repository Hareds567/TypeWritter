import React from "react";
import "./App.css";
//Components
import TypeWriter from "./Components/TypeWriter/TypeWriter";
import Header from "./Components/Header/Header";
import Graph from "./Components/TypeWriter/Graph/Graph";
import Menu from "./Components/Menu/Menu";
//icons
import { ReactComponent as Refresh } from "./Icons/rotate-cw.svg";
//Types
import { createEmptyData } from "./Components/TypeWriter/TypeWriter";
import Word from "./Classes/Word";
//classes
import {
  getRandomText,
  getRandomTextByType,
} from "./Methods/TypeWriter/TypeWriter";
import { sentenceToWordArr } from "./Methods/TypeWriter/TypeWriter";
import { getLabel } from "./Components/Menu/Menu";

function App() {
  const [refresh, set_Refresh] = React.useState(false);
  const [data, set_Data] = React.useState(createEmptyData());
  const [content, set_content] = React.useState(getRandomText());
  const [focus, set_focus] = React.useState(false);
  const [menu, set_menu] = React.useState<{ testType: number; mode: number }>(
    () => {
      const temp = getLabel();
      return { testType: temp.activeLabel, mode: temp.type };
    }
  );
  const [testIsFinished, set_testIsFinished] = React.useState(false);

  const [currentLocation, set_currenLocation] = React.useState(0);

  //====================================================================
  function onclick() {
    const menu = document.getElementById("menu-subContainer1");
    const typeWriter = document.getElementById("TypeWriter-container");
    const refresh = document.getElementById("refresh-icon");
    const message = document.getElementById("outOfFocusMessage");
    const writeContainer = document.getElementById("writeContainer");

    if (
      document.activeElement === menu ||
      document.activeElement === typeWriter ||
      document.activeElement === refresh ||
      document.activeElement === message ||
      document.activeElement === writeContainer
    ) {
      set_focus(true);
      return;
    }
    set_focus(false);
  }

  //====================================================================
  const getContent = React.useCallback(() => {
    if (menu.mode === 0) {
      if (menu.testType === 0) {
        return getRandomText();
      }
      return getRandomTextByType(menu.testType);
    }
    return getRandomText();
  }, [menu]);

  function nextText() {
    set_testIsFinished(false);
    set_Refresh(true);
  }

  function repeatText() {
    const newSentence = sentenceToWordArr(content.obj.content);

    const text = { sentence: newSentence, obj: content.obj };
    set_content(text);
    set_testIsFinished(false);
  }

  function getTestType() {
    let result = "";
    if (menu.mode === 0) {
      result += "quote ";
      menu.testType === 1
        ? (result += "short")
        : menu.testType === 2
        ? (result += "medium")
        : menu.testType === 3
        ? (result += "long")
        : (result += "random");
    }
    return result;
  }
  //====================================================================
  //Menu Options changes
  React.useEffect(() => {
    if (currentLocation === 1) {
      set_content(getContent());
    }
  }, [menu, currentLocation, getContent]);

  //====================================================================
  function onRefresh() {
    set_Refresh(true);

    // set_content(getContent());
  }

  React.useEffect(() => {
    if (refresh) {
      set_content(getContent());
      set_Refresh(false);
    }
  }, [refresh, getContent]);
  return (
    <div
      className="App"
      onClick={() => {
        onclick();
      }}
    >
      <div className="mainContainer">
        <Header />
        {!testIsFinished ? (
          <>
            <div className="subContainer1">
              <Menu
                set_menu={set_menu}
                set_content={set_content}
                set_currenLocation={set_currenLocation}
              />
            </div>
            <div className="subContainer2">
              <TypeWriter
                content={content.sentence}
                refresh={refresh}
                set_Refresh={set_Refresh}
                set_Data={set_Data}
                focus={focus}
                set_focus={set_focus}
                set_testIsFinished={set_testIsFinished}
              />
              <div
                className="refresh-icon"
                id={`refresh-icon`}
                tabIndex={0}
                onClick={() => {
                  onRefresh();
                }}
                onKeyUpCapture={(e) => {
                  e.key === "Enter" && onRefresh();
                }}
              >
                <Refresh />
              </div>
            </div>
          </>
        ) : (
          <div className="subContainer3">
            {testIsFinished && (
              <>
                <Graph
                  data={data}
                  obj={content.obj}
                  nextText={nextText}
                  repeatTest={repeatText}
                  getTestType={getTestType}
                  set_currenLocation={set_currenLocation}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
