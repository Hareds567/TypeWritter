import React, { useEffect, useRef } from "react";
import "./App.css";
//Components
import TypeWriter from "./Components/TypeWriter/TypeWriter";
import Header from "./Components/Header/Header";
import Graph from "./Components/TypeWriter/Graph/Graph";
import Menu from "./Components/Menu/Menu";
//icons
import { ReactComponent as Refresh } from "./Icons/rotate-cw.svg";
//Types
import { createEmptyData, PostData } from "./Components/TypeWriter/TypeWriter";
import Word from "./Classes/Word";
//classes
import {
  getRandomText,
  getRandomTextByType,
} from "./Methods/TypeWriter/TypeWriter";
import { sentenceToWordArr } from "./Methods/TypeWriter/TypeWriter";
import { getLabel } from "./Components/Menu/Menu";
import { length, Text } from "./Texts/Texts";

function App() {
  const [refresh, set_Refresh] = React.useState(false);
  const [data, set_Data] = React.useState(createEmptyData());
  const [content, set_content] = React.useState<{
    sentence: Word[];
    obj: Text;
  }>({ sentence: [], obj: { content: "", source: "", type: length.long } });
  const [focus, set_focus] = React.useState(false);
  const [postData, set_postData] = React.useState<PostData>({
    characters: [],
    initialTime: 0,
  });
  const [menu, set_menu] = React.useState<{ testType: number; mode: number }>(
    () => {
      const temp = getLabel();
      return { testType: temp.activeLabel, mode: temp.type };
    }
  );
  const [testIsFinished, set_testIsFinished] = React.useState(false);
  const [currentLocation, set_currenLocation] = React.useState(0);

  const [temp, set_temp] = React.useState<Word[]>([]);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      set_temp(content.sentence);
      first.current = false;
    }
  }, [content.sentence]);
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
    first.current = true;
    set_Refresh(true);
  }

  function repeatText() {
    first.current = true;
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
      const temp = getContent();
      set_content(temp);
      set_temp(temp.sentence);
    }
  }, [menu, currentLocation, getContent]);

  //====================================================================
  function onRefresh() {
    set_Refresh(true);
  }

  React.useEffect(() => {
    if (refresh) {
      const temp = getContent();
      set_content(temp);
      set_temp(temp.sentence);
      set_Refresh(false);
    }
  }, [refresh, getContent]);

  useEffect(() => {
    const text = getContent();
    set_content(text);
    set_temp(text.sentence);
  }, [getContent]);

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
                set_focus={set_focus}
                set_testIsFinished={set_testIsFinished}
                set_postData={set_postData}
                focus={focus}
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
                  postData={postData}
                  data={data}
                  obj={content.obj}
                  content={temp}
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
