import * as React from "react";
import { useState, useRef, useEffect, FC } from "react";
import "./styles.css";

import Word from "../../Classes/Word";
import { Text } from "../../Texts/Texts";
//Components
import { Word as WordContainer } from "./Word/Word";
//Methods
import { calculateWPM } from "../../Methods/Graph/Graph";
import { sentenceToWordArr } from "../../Methods/TypeWriter/TypeWriter";
import Letter from "../../Classes/Letter";

export type Data = {
  labels: Array<number>;
  wpm_Arr: Array<number>;
  raw_wpm_Arr: Array<number>;
  err_Arr: Array<{ x: number; y: number }>;
  numberOfCorrectInputs: number;
  numberOfIncorrectInputs: number;
  numberOfExtraInputs: number;
  numberOfMissedInputs: number;
  totalNumberOfInputs: number;
  totalTime: number;
  accuracy: number;
};

export enum InputType {
  normal = 0,
  visited = 1,
  error = 2,
  extra = 3,
  erased = 4,
  space = 5,
  caps = 6,
}
export type Character = {
  inputType: InputType;
  character: string;
  time: number;
  sentence: Word[];
  wordIdx: number;
  letterIdx: number;
};
export type PostData = {
  characters: Character[];
  initialTime: number;
};

export function createEmptyData() {
  const data: Data = {
    labels: [],
    numberOfCorrectInputs: 0,
    numberOfIncorrectInputs: 0,
    totalNumberOfInputs: 0,
    raw_wpm_Arr: [],
    wpm_Arr: [],
    err_Arr: [],
    accuracy: 0,
    totalTime: 0,
    numberOfExtraInputs: 0,
    numberOfMissedInputs: 0,
  };
  return data;
}
//Difference in time
//Total number of word written in that time

interface Props {
  refresh: boolean;
  content: Text;
  set_Refresh: React.Dispatch<React.SetStateAction<boolean>>;
  set_Data: React.Dispatch<React.SetStateAction<Data>>;
  set_focus: React.Dispatch<React.SetStateAction<boolean>>;
  set_testIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
  set_postData: React.Dispatch<React.SetStateAction<PostData>>;
  focus: boolean;
}

//Deep copy of Array
/**
 *
 * @param arr
 * @returns Returns a Deep copy of an Array<T>
 */
function copyArr<T>(arr: Array<T>) {
  const temp = JSON.parse(JSON.stringify(arr)) as typeof arr;
  return temp;
}

const TypeWriter: FC<Props> = ({
  refresh,
  set_Refresh,
  set_Data,
  content,
  focus,
  set_focus,
  set_testIsFinished,
  set_postData,
}) => {
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
  const [capsIsOn, set_capsIsOn] = useState(false);
  //Typing Data values
  const [currentWord, set_currentWord] = useState<Word>();
  const isDeleting = useRef(false);
  //Stats Values
  const initialTime = useRef(0);
  const finalTime = useRef(0);
  const [isActive, set_isActive] = useState(false);
  const data = useRef<Data>(createEmptyData());
  const postData = useRef<PostData>({ characters: [], initialTime: 0 });

  //====================================================================
  function resetValues() {
    initialTime.current = 0;
    finalTime.current = 0;
    lineWidth.current = 0;
    lineWordCount.current = 0;
    lineNum.current = 0;
    letterIndex2.current = 0;
    wordIndex2.current = 0;
    lastWordIdx.current = 0;
    active_letter_indx.current = { word_idx: 0, letter_idx: 0 };
    data.current = createEmptyData();
    set_isActive(false);
  }

  //====================================================================
  function enableFocus() {
    container.current !== document.activeElement && container.current?.focus();
  }
  const focusContainer = React.useCallback(() => {
    document.body.onkeyup = (e) => {
      if (e.key === "Tab") return;
      set_isFocused(true);
    };
  }, []);

  //====================================================================
  //Handle Focus
  useEffect(() => {
    focusContainer();
    if (isFocused) {
      set_focus(true);
      enableFocus();
    }
  }, [isFocused, focusContainer, set_focus]);

  //====================================================================
  //Update Word on Content Change
  useEffect(() => {
    set_wordArr(sentenceToWordArr(content.content));
    set_isFocused(true);
    resetValues();
  }, [content]);

  //====================================================================

  function handleEndOfLine(currentWordElement: HTMLScriptElement) {
    if (!container.current) return;
    //Update line width
    const nextElementSibling =
      currentWordElement.nextElementSibling as HTMLScriptElement;
    lineWidth.current += currentWordElement.offsetWidth + 8;

    //Get next word width
    const nextWordWidth = nextElementSibling.offsetWidth;

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
        return;
      }
    }
  }

  //====================================================================

  function onKeyDown2(e: React.KeyboardEvent<HTMLDivElement>) {
    if (
      container.current &&
      (e.code === "Backspace" || e.code === "Space" || e.key.length <= 1)
    ) {
      //We are at start
      if (e.code !== "Backspace") data.current.totalNumberOfInputs++;
      isDeleting.current = false;

      //Check if keyboard Input is equal to a letter ---------------------------------
      if (
        wordArr[wordIndex2.current].letters[letterIndex2.current] &&
        wordArr[wordIndex2.current].letters[letterIndex2.current].letter ===
          e.key
      ) {
        //Check if We are at the START of the sentence =========
        if (wordIndex2.current === 0 && letterIndex2.current === 0) {
          set_isActive(true);
          initialTime.current = new Date().getTime();
          postData.current.initialTime = initialTime.current;
        }
        //Check if We are at the END of the sentence =========
        if (
          wordIndex2.current === wordArr.length - 1 &&
          letterIndex2.current ===
            wordArr[wordArr.length - 1].letters.length - 1
        ) {
          finalTime.current = new Date().getTime();
          set_isActive(false);
        }

        //Update Stats values
        data.current.numberOfCorrectInputs++;

        //Update Object values
        const temp = [...wordArr];
        temp[wordIndex2.current].letters[letterIndex2.current].wasVisited =
          true;
        set_wordArr([...temp]);

        //Update PostData character
        const newCharacter: Character = {
          character: e.key,
          time: new Date().getTime(),
          inputType: InputType.visited,
          sentence: copyArr(temp),
          letterIdx: letterIndex2.current,
          wordIdx: wordIndex2.current,
        };
        //Update Idx
        letterIndex2.current++;
        postData.current.characters.push(newCharacter);

        //Update GUI values
        active_letter_indx.current.letter_idx++;
        return;
      }

      //We are at the end of a Word ---------------------------------
      if (e.code === "Space" && letterIndex2.current > 0) {
        if (wordIndex2.current === wordArr.length - 1) {
          return;
        }
        let error = false;

        //Check if there are any errors in a Word
        wordArr[wordIndex2.current].letters.every((letter) => {
          if (letter.incorrect || !letter.wasVisited) {
            //Data
            data.current.numberOfIncorrectInputs++;
            data.current.numberOfMissedInputs +=
              wordArr[wordIndex2.current].letters.length - letter.id;
            error = true;
            //Update Word[]
            let temp = copyArr(wordArr);
            temp[wordIndex2.current].isBugged = true;
            set_wordArr([...temp]);
            //Update PostData character
            const newCharacter: Character = {
              character: e.key,
              time: new Date().getTime(),
              inputType: InputType.space,
              sentence: copyArr(temp),
              letterIdx: letterIndex2.current,
              wordIdx: wordIndex2.current,
            };
            postData.current.characters.push(newCharacter);
            return false;
          }
          return true;
        });

        const temp: HTMLScriptElement = container.current.children[
          wordIndex2.current
        ] as HTMLScriptElement;
        handleEndOfLine(temp);

        //Handle end of line -----
        //Arr Manipulation Values
        lineWordCount.current++;
        wordIndex2.current++;
        letterIndex2.current = 0;
        set_currentWord(wordArr[wordIndex2.current]);

        //Update Stats values
        if (!error) data.current.numberOfCorrectInputs++;

        //GUI
        active_letter_indx.current.word_idx++;
        active_letter_indx.current.letter_idx = 0;

        return;
      }

      //Input is BACKSPACE ---------------------------------
      if (e.code === "Backspace") {
        if (wordIndex2.current === 0 && letterIndex2.current === 0) return;
        //Next BACKSPACE leads to previous WORD
        if (letterIndex2.current === 0 && wordIndex2.current > 0) {
          //Update Word Index
          wordIndex2.current--;
          active_letter_indx.current.word_idx--;
          //Update Word Status
          let temp = copyArr(wordArr);
          temp[wordIndex2.current].isBugged = false;
          set_wordArr(temp);
          //Update Letter Index
          let newIndex: number;
          wordArr[wordIndex2.current].letters.every((letter) => {
            if (!letter.wasVisited) {
              newIndex = letter.id;
              data.current.numberOfIncorrectInputs--;
              data.current.numberOfMissedInputs -=
                wordArr[wordIndex2.current].letters.length - 1 - (newIndex - 1);
              active_letter_indx.current.letter_idx = newIndex;
              letterIndex2.current = newIndex;
              //Update PostData character
              const newCharacter: Character = {
                character: e.key,
                time: new Date().getTime(),
                inputType: InputType.space,
                sentence: copyArr(temp),
                wordIdx: wordIndex2.current,
                letterIdx: letterIndex2.current,
              };
              postData.current.characters.push(newCharacter);
              return false;
            }
            active_letter_indx.current.letter_idx =
              wordArr[wordIndex2.current].letters.length;

            letterIndex2.current = wordArr[wordIndex2.current].letters.length;
            //Update PostData character
            const newCharacter: Character = {
              character: e.key,
              time: new Date().getTime(),
              inputType: InputType.space,
              sentence: copyArr(temp),
              wordIdx: wordIndex2.current,
              letterIdx: letterIndex2.current,
            };
            postData.current.characters.push(newCharacter);
            return true;
          });

          //Update necessary GUI values
          lineWordCount.current--;

          //Update Line Width
          const word = container.current.children[
            wordIndex2.current
          ] as HTMLElement;
          lineWidth.current -= word.offsetWidth + 8;

          //Update word Arr
          set_currentWord(wordArr[wordIndex2.current - 1]);
          isDeleting.current = true;
          return;
        }

        //In word BACKSPACE =====
        const temp = [...wordArr];
        if (
          temp[wordIndex2.current].letters[letterIndex2.current - 1].wasAdded
        ) {
          //Erase extra words
          data.current.numberOfExtraInputs--;
          temp[wordIndex2.current].letters.pop();
        } else {
          if (
            temp[wordIndex2.current].letters[letterIndex2.current - 1].incorrect
          ) {
            data.current.numberOfIncorrectInputs--;
          }
          temp[wordIndex2.current].isBugged = false;
          temp[wordIndex2.current].letters[
            letterIndex2.current - 1
          ].wasVisited = false;
          temp[wordIndex2.current].letters[letterIndex2.current - 1].incorrect =
            false;
        }
        //Values
        letterIndex2.current--;
        active_letter_indx.current.letter_idx--;
        isDeleting.current = true;
        set_wordArr([...temp]);
        //Update PostData character
        const newCharacter: Character = {
          character: e.key,
          time: new Date().getTime(),
          inputType: InputType.space,
          sentence: copyArr(temp),
          wordIdx: wordIndex2.current,
          letterIdx: letterIndex2.current,
        };
        postData.current.characters.push(newCharacter);
        return;
      }

      // If input does not Match letter ---------------------------------
      if (letterIndex2.current !== wordArr[wordIndex2.current].letters.length) {
        //Update PostData character
        //
        data.current.numberOfIncorrectInputs++;

        let temp = copyArr(wordArr);
        temp[wordIndex2.current].letters[letterIndex2.current].incorrect = true;
        temp[wordIndex2.current].letters[letterIndex2.current].wasVisited =
          true;
        set_wordArr([...temp]);
        letterIndex2.current++;
        active_letter_indx.current.letter_idx++;
        //Update PostData character
        const newCharacter: Character = {
          character: e.key,
          time: new Date().getTime(),
          inputType: InputType.space,
          sentence: copyArr(temp),
          letterIdx: letterIndex2.current,
          wordIdx: wordIndex2.current,
        };
        postData.current.characters.push(newCharacter);
        return;
      }

      // Adding Incorrect values to a WORD (Extra Inputs) --------------------------
      if (e.key.length <= 1) {
        //Stats
        data.current.numberOfIncorrectInputs++;
        data.current.numberOfExtraInputs++;
        //Values
        const temp = [...wordArr];
        const newLetter = new Letter(e.key, letterIndex2.current);
        newLetter.incorrect = true;
        newLetter.wasVisited = true;
        newLetter.wasAdded = true;
        temp[wordIndex2.current].letters.push(newLetter);
        set_wordArr([...temp]);
        letterIndex2.current++;
        active_letter_indx.current.letter_idx++;
        //Update PostData character
        const newCharacter: Character = {
          character: e.key,
          time: new Date().getTime(),
          inputType: InputType.space,
          sentence: copyArr(temp),
          letterIdx: letterIndex2.current,
          wordIdx: wordIndex2.current,
        };
        postData.current.characters.push(newCharacter);
        return;
      }
    }

    if (e.getModifierState("CapsLock")) {
      //Update PostData character
      const newCharacter: Character = {
        character: e.key,
        time: new Date().getTime(),
        inputType: InputType.space,
        sentence: copyArr(wordArr),
        letterIdx: letterIndex2.current,
        wordIdx: wordIndex2.current,
      };
      postData.current.characters.push(newCharacter);
      set_capsIsOn(true);
    } else {
      set_capsIsOn(false);
    }
  }

  //====================================================================

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (isActive) {
      let errorNum = 0;
      let count = 1;
      interval = setInterval(() => {
        //Calculate Raw WPM
        const WPM = calculateWPM(
          data.current.totalNumberOfInputs,
          (new Date().getTime() - initialTime.current) / 1000 / 60
        );
        data.current.raw_wpm_Arr.push(WPM);

        //Calculate Net WPM
        const netWPM = calculateWPM(
          data.current.numberOfCorrectInputs,
          (new Date().getTime() - initialTime.current) / 1000 / 60
        );
        data.current.wpm_Arr.push(netWPM);

        //Label
        data.current.labels.push(count);

        //Errors
        if (
          data.current.totalNumberOfInputs -
            data.current.numberOfCorrectInputs >
          errorNum
        ) {
          let error = {
            y:
              data.current.totalNumberOfInputs -
              data.current.numberOfCorrectInputs -
              errorNum,
            x: count,
          };
          data.current.err_Arr.push(error);
          errorNum =
            data.current.totalNumberOfInputs -
            data.current.numberOfCorrectInputs;
        }
        count++;
      }, 1000);

      let tempPostData = postData.current;
      return () => {
        //PostData
        set_postData(tempPostData);
        // console.log(tempPostData);
        //Last Raw WPM
        const WPM = calculateWPM(
          data.current.totalNumberOfInputs,
          (finalTime.current - initialTime.current) / 1000 / 60
        );
        if (WPM > 0) {
          wordIndex2.current++;

          data.current.raw_wpm_Arr.push(WPM);
          //Last Net WPM
          const netWPM =
            (data.current.totalNumberOfInputs / 5 -
              data.current.numberOfIncorrectInputs) /
            ((finalTime.current - initialTime.current) / 1000 / 60);
          data.current.wpm_Arr.push(netWPM);

          //Total Time
          data.current.totalTime =
            ((finalTime.current - initialTime.current) / 1000) % 60;

          //Accuracy

          const number: number =
            data.current.numberOfCorrectInputs /
            data.current.totalNumberOfInputs;
          data.current.accuracy =
            Math.round((number + Number.EPSILON) * 10000) / 10000;

          //Label
          data.current.labels.push(data.current.totalTime);
          //

          set_Data(data.current);
          clearInterval(interval);
          set_testIsFinished(true);
        } else {
          clearInterval(interval);
        }
      };
    }
  }, [isActive, set_Data, set_testIsFinished, set_postData]);

  //====================================================================
  return (
    <>
      <div className="extraData">
        <div
          className={`wordIndex`}
        >{`${wordIndex2.current}  / ${wordArr.length}`}</div>
        <div className={`capsContainer`}>
          <div className={`capsLock ${capsIsOn ? "true" : ""}`}>caps lock</div>
        </div>
      </div>
      <div className="TypeWriter-container">
        <div
          className={`writeContainer ${!focus && "onBlur"}`}
          id={"writeContainer"}
          ref={container}
          tabIndex={0}
          onKeyDown={(e) => onKeyDown2(e)}
          onBlur={(e) => {
            set_isFocused(false);
          }}
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
        {!focus && (
          <div
            className="outOfFocusMessage"
            id={`outOfFocusMessage`}
            tabIndex={0}
            onClick={(e) => {
              set_isFocused(true);
              set_focus(true);
            }}
          >
            Click or press any key to Focus
          </div>
        )}
      </div>
    </>
  );
};

export default TypeWriter;
