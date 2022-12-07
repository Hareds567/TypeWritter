import React, { FC, useRef } from "react";
//
import { Word } from "../../../../Classes/Word";
//
import WordContainer from "./WordContainer/WordContainer";
//
import "./Replay.css";
//
import { PostData, Character } from "../../../TypeWriter/TypeWriter";
import { sentenceToWordArr } from "../../../../Methods/TypeWriter/TypeWriter";
//
import { ReactComponent as PlayIcon } from "../../../../Icons/play.svg";

import { ReactComponent as PauseIcon } from "../../../../Icons/pause.svg";

interface Props {
  content: string;
  postData: PostData;
}

export const Replay: FC<Props> = ({ content, postData }) => {
  const [sentence, set_sentence] = React.useState<Word[]>([]);
  const [isPlaying, set_isPlaying] = React.useState(false);
  const data = React.useRef(postData);

  const letterIndex = useRef(0);
  const wordIndex = useRef(0);
  const dataIndex = useRef(0);
  const currTimeout = useRef<NodeJS.Timeout>();
  const timer = useRef(0);
  //
  const tempDataIndex = useRef(0);

  function setDelay(previousData: Character, currData: Character) {
    if (dataIndex.current === 0) {
      return postData.initialTime - data.current.characters[0].time;
    }
    return previousData.time - currData.time;
  }

  React.useEffect(() => {
    const temp = sentenceToWordArr(content);
    set_sentence(temp);
  }, [content]);

  function animation(delay: number) {
    if (dataIndex.current >= data.current.characters.length) {
      dataIndex.current = 0;
      set_isPlaying(false);
      clearTimeout(currTimeout.current);
      return;
    }

    currTimeout.current = setTimeout(() => {
      const currData = data.current.characters[dataIndex.current];
      delay = setDelay(
        data.current.characters[dataIndex.current],
        data.current.characters[dataIndex.current - 1]
      );

      timer.current += delay;

      set_sentence([...currData.sentence]);
      dataIndex.current++;
      letterIndex.current = currData.letterIdx;
      wordIndex.current = currData.wordIdx;
      animation(delay);
    }, delay);
  }

  function handleTime() {
    const result = `${Math.round(timer.current / 1000)}s`;
    return result;
  }

  function startReplay() {
    set_isPlaying(true);
    dataIndex.current = tempDataIndex.current;
    animation(0);
  }

  function resetReplay() {
    stopReplay();
    dataIndex.current = -1;
    tempDataIndex.current = 0;
    wordIndex.current = 0;
    letterIndex.current = 0;
    const temp = sentenceToWordArr(content);
    timer.current = 0;
    set_sentence(temp);
  }

  function stopReplay(index?: number, time?: number) {
    if (!index) {
      tempDataIndex.current = dataIndex.current;
    } else {
      tempDataIndex.current = index;
    }
    if (time) {
      timer.current = time - postData.initialTime;
    }
    dataIndex.current = data.current.characters.length;
    set_isPlaying(false);
  }

  return (
    <div className="replay-container">
      <div className="replay-options">
        <div
          style={{
            marginRight: "1rem",
            userSelect: "none",
            color: "var(--color-3)",
          }}
        >
          watch replay
        </div>

        {!isPlaying ? (
          <div
            className="buttons-button"
            onClick={() => startReplay()}
            data-hover={"Resume replay"}
          >
            <PlayIcon />
          </div>
        ) : (
          <div
            className="buttons-button"
            onClick={() => stopReplay()}
            data-hover={"Pause replay"}
          >
            <PauseIcon />
          </div>
        )}
        <div
          className={`replay-container-timer`}
          data-hover={timer.current / 1000}
        >
          {handleTime()}
        </div>
        {/* <div className="buttons-button" onClick={() => resetReplay()}>
          Reset
        </div> */}
      </div>

      <div>
        <div className="sentence-container">
          {sentence.map((word) => {
            return (
              <WordContainer
                key={`replay-${word.idx}`}
                word={word}
                postData={data.current}
                set_sentence={set_sentence}
                stopReplay={stopReplay}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Replay;
