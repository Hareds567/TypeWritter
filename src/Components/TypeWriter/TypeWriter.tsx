import * as React from "react";
import { useState, useRef, useEffect, FC } from "react";
import "./styles.css";

import Word from "../../Classes/Word";
import { sentenceToWordArr } from "../../Methods/TypeWriter/TypeWriter";

//API
import { getShortStory } from "../../API/Documents";
//Components
import { Word as WordContainer } from "./Word/Word";
import { TIMEOUT } from "dns";
//Methods
import { calculateWPM } from "../../Methods/Graph/Graph";
// import { clearInterval } from "timers";

type Data = {
  wpm_Arr: Array<number>;
  raw_wpm_Arr: Array<number>;
  numberOfCorrectInputs: number;
  numberOfIncorrectInputs: number;
  totalNumberOfInputs: number;
  accuracy: number;
};

//Difference in time
//Total number of word written in that time

interface Props {
  refresh: boolean;
  set_Refresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const text =
  "better known by his pen name and, later, legal name Pablo Neruda, was a Chilean poet-diplomat and politician who won the 1971 Nobel Prize in Literature.";

const TypeWriter: FC<Props> = ({ refresh, set_Refresh }) => {
  //Text
  const [wordArr, set_wordArr] = useState<Word[]>([]);
  //Containers
  const container = useRef<HTMLDivElement>(null);
  //GUI manipulation values
  const lineWidth = useRef(0);
  const lineWordCount = useRef(0);
  const lineNum = useRef(1);
  const letterIndex2 = useRef(0);
  const wordIndex2 = useRef(0);
  const lastWordIdx = useRef(0);
  const active_letter_indx = useRef({ word_idx: 0, letter_idx: 0 });
  const [isFocused, set_isFocused] = useState(true);
  //Typing Data values
  const [currentWord, set_currentWord] = useState<Word>();
  const isDeleting = useRef(false);

  //====================================================================
  function enableFocus(e: KeyboardEvent) {
    if (e.key === "Tab") return;
    set_isFocused(true);
  }

  //====================================================================
  const focusContainer = React.useCallback(() => {
    document.body.onkeyup = (e) => enableFocus(e);
  }, []);

  //====================================================================
  //Handle Focus
  useEffect(() => {
    focusContainer();
    if (refresh) {
      set_wordArr(sentenceToWordArr(text));
      lineWidth.current = 0;
      lineWordCount.current = 0;
      lineNum.current = 0;
      letterIndex2.current = 0;
      wordIndex2.current = 0;
      lastWordIdx.current = 0;
      active_letter_indx.current = { word_idx: 0, letter_idx: 0 };
      container.current !== document.activeElement &&
        container.current?.focus();
      set_isFocused(true);
      set_Refresh(false);
    }
  }, [refresh, set_Refresh, focusContainer]);

  useEffect(() => {
    if (isFocused)
      container.current !== document.activeElement &&
        container.current?.focus();
  }, [isFocused]);

  //====================================================================
  //Fetch and build Sentence
  useEffect(() => {
    const abort = new AbortController();
    // async function fetch() {
    //   const data = await getShortStory(abort.signal);
    //   const text = sentenceToWordArr(data.story);

    //   set_wordArr(text);
    // }

    set_wordArr(sentenceToWordArr(text));
    // fetch();

    function onRefresh() {
      set_wordArr([]);
      lineWidth.current = 0;
    }
    return () => {
      abort.abort();
      onRefresh();
    };
  }, []);

  //====================================================================

  function handleEndOfLine(currentWordElement: HTMLScriptElement) {
    if (!container.current) return;
    //Update line width
    const nextElementSibling =
      currentWordElement.nextElementSibling as HTMLScriptElement;
    lineWidth.current += currentWordElement.offsetWidth + 8;
    // parseInt(
    //   window.getComputedStyle(currentWordElement).getPropertyValue("width")
    // ) + 8;
    //Get next word width
    const nextWordWidth = nextElementSibling.offsetWidth;

    console.log("NEXT SIBLING: ");
    console.log(currentWordElement.nextElementSibling);

    //Check if we are at the end of the current line
    //If so update Word array
    if (
      lineWidth.current + nextWordWidth >
      parseInt(
        window.getComputedStyle(container.current).getPropertyValue("width")
      )
    ) {
      // If line = 1 get last word of the line
      if (lineNum.current === 1) {
        lastWordIdx.current = wordIndex2.current;
        lineNum.current += 1;
        lineWidth.current = 0;
        lineWordCount.current = 0;

        console.log("-------------------------------------------------------");
        return;
      }
      // If line = 2 update the Word array and update values
      if (lineNum.current === 2) {
        //Update Word array
        set_wordArr(wordArr.slice(lastWordIdx.current + 1, undefined));
        wordIndex2.current = lineWordCount.current - 1; //this works
        letterIndex2.current = 0;
        lineNum.current = 2;
        lineWidth.current = 0;
        lineWordCount.current = 0;
        lastWordIdx.current = wordIndex2.current;
        console.log("-------------------------------------------------------");
        return;
      }
    }
  }

  //====================================================================

  function onKeyDown2(e: React.KeyboardEvent<HTMLDivElement>) {
    data.current.totalNumberOfInputs++;
    isDeleting.current = false;

    //Check if keyboard Input is equal to a letter ---------------------------------
    if (
      wordArr[wordIndex2.current].letters[letterIndex2.current] &&
      wordArr[wordIndex2.current].letters[letterIndex2.current].letter === e.key
    ) {
      //Update Stats values
      data.current.numberOfCorrectInputs++;

      //Check if We are at the START of the sentence =========
      if (wordIndex2.current === 0 && letterIndex2.current === 0) {
        set_isActive(true);
        initialTime.current = new Date().getTime();
      }
      //Check if We are at the END of the sentence =========
      if (
        wordIndex2.current === wordArr.length - 1 &&
        letterIndex2.current === wordArr[wordArr.length - 1].letters.length - 1
      ) {
        finalTime.current = new Date().getTime();
        set_isActive(false);
      }

      //Update Object values
      const temp = [...wordArr];
      temp[wordIndex2.current].letters[letterIndex2.current].wasVisited = true;
      set_wordArr([...temp]);
      letterIndex2.current++;
      //Update GUI values
      active_letter_indx.current.letter_idx++;
      return;
    }

    //We are at the end of a Word ---------------------------------
    if (e.code === "Space" && letterIndex2.current > 0) {
      // if (wordIndex2.current === wordArr.length - 1) {
      //   return;
      // }

      // wordArr[wordIndex2.current].letters.every((letter) => {
      //   if (letter.incorrect || !letter.wasVisited) {
      //     let temp = [...wordArr];
      //     temp[wordIndex2.current].isBugged = true;
      //     set_wordArr([...temp]);
      //     return false;
      //   }
      //   return true;
      // });

      console.log("BEFORE: ");
      console.log(`CURRENT WORD INDEX: ${wordIndex2.current}`);
      container.current &&
        console.log(container.current.children[wordIndex2.current]);
      // console.log(
      //   `LENGTH TO BE COMPARED: ${lineWidth.current + nextWordWidth}`
      // );
      console.log("======");
      if (container.current) {
        const temp: HTMLScriptElement = container.current.children[
          wordIndex2.current
        ] as HTMLScriptElement;
        handleEndOfLine(temp);
      }
      //Handle end of line
      // container.current &&

      //Arr Manipulation Values
      lineWordCount.current++;
      wordIndex2.current++;
      letterIndex2.current = 0;
      set_currentWord(wordArr[wordIndex2.current]);

      //Update Stats values
      data.current.numberOfCorrectInputs++;

      //GUI
      active_letter_indx.current.word_idx++;
      active_letter_indx.current.letter_idx = 0;

      // Console.log
      console.log("AFTER: ");
      console.log(`LINE NUMBER: ${lineNum.current}`);
      console.log(`LINE WIDTH: ${lineWidth.current}`);
      console.log(`WORD COUNT: ${lineWordCount.current}`);
      console.log(`CURRENT WORD INDEX: ${wordIndex2.current}`);
      console.log(`LAST WORD INDEX: ${lastWordIdx.current}`);

      container.current &&
        console.log(
          parseInt(
            window.getComputedStyle(container.current).getPropertyValue("width")
          )
        );

      return;
    }

    //Input is BACKSPACE ---------------------------------
    // if (e.code === "Backspace") {
    //   if (letterIndex2.current === 0 && wordIndex2.current > 0) {
    //     active_letter_indx.current.letter_idx =
    //       wordArr[wordIndex2.current - 1].letters.length;
    //     letterIndex2.current = wordArr[wordIndex2.current - 1].letters.length;

    //     active_letter_indx.current.word_idx--;
    //     wordIndex2.current--;

    //     if (container.current) {
    //       const word = container.current.children[wordIndex2.current];
    //       window.getComputedStyle(word).getPropertyValue("width");
    //       lineWidth.current -= parseInt(
    //         window.getComputedStyle(word).getPropertyValue("width")
    //       );
    //     }

    //     //==================
    //     set_currentWord(wordArr[wordIndex2.current - 1]);
    //     isDeleting.current = true;
    //     return;
    //     // Index should be + 1 but out of bounce
    //   }

    //   const temp = wordArr;
    //   temp[wordIndex2.current].isBugged = false;
    //   temp[wordIndex2.current].letters[letterIndex2.current - 1].wasVisited =
    //     false;
    //   temp[wordIndex2.current].letters[letterIndex2.current - 1].incorrect =
    //     false;
    //   letterIndex2.current--;
    //   active_letter_indx.current.letter_idx--;
    //   isDeleting.current = true;
    //   set_wordArr([...temp]);
    //   console.log(active_letter_indx.current);
    //   return;
    // }

    //If input does not Match letter ---------------------------------
    //   if (
    //     e.key.length <= 1 &&
    //     letterIndex2.current <= wordArr[wordIndex2.current].letters.length - 1
    //   ) {
    //     data.current.numberOfIncorrectInputs++;
    //     let temp = [...wordArr];
    //     temp[wordIndex2.current].letters[letterIndex2.current].incorrect = true;
    //     set_wordArr([...temp]);
    //     letterIndex2.current++;
    //     active_letter_indx.current.letter_idx++;
    //   }
  }

  //====================================================================
  const initialTime = useRef(0);
  const finalTime = useRef(0);
  const currentTime = useRef(0);
  const [isActive, set_isActive] = useState(false);
  const data = useRef<Data>({
    numberOfCorrectInputs: 0,
    numberOfIncorrectInputs: 0,
    totalNumberOfInputs: 0,
    raw_wpm_Arr: [],
    wpm_Arr: [],
    accuracy: 0,
  });

  //====================================================================
  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isActive) {
      interval = setInterval(() => {
        const WPM = calculateWPM(
          data.current.totalNumberOfInputs,
          (new Date().getTime() - initialTime.current) / 1000 / 60
        );
        data.current.raw_wpm_Arr.push(WPM);
      }, 1000);

      return () => {
        const WPM = calculateWPM(
          data.current.totalNumberOfInputs,
          (finalTime.current - initialTime.current) / 1000 / 60
        );
        data.current.raw_wpm_Arr.push(WPM);
        // console.log(data.current);
        // console.log(((finalTime.current - initialTime.current) / 1000) % 60);
        clearInterval(interval);
      };
    }
  }, [isActive]);

  //====================================================================
  return (
    <div className="TypeWriter-container">
      <div
        className={`writeContainer ${!isFocused && "onBlur"}`}
        id={"writeContainer"}
        ref={container}
        tabIndex={0}
        onKeyDown={(e) => onKeyDown2(e)}
        onBlur={(e) => set_isFocused(false)}
      >
        {wordArr.map((word) => {
          return (
            <WordContainer
              key={word.idx}
              word={word}
              active_letter_indx={active_letter_indx.current}
              isDeleting={isDeleting.current}
            />
          );
        })}
      </div>
      {!isFocused && (
        <div className="outOfFocusMessage" onClick={(e) => set_isFocused(true)}>
          Click or press any key to Focus
        </div>
      )}
    </div>
  );
};

export default TypeWriter;
