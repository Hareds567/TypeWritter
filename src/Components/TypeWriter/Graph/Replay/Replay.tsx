import React, { FC, useRef } from "react";
//
import { Word } from "../../../../Classes/Word";
import { Letter } from "../../../../Classes/Letter";
//
import WordContainer from "./WordContainer/WordContainer";
//
import "./Replay.css";
//
import { PostData, InputType, Character } from "../../../TypeWriter/TypeWriter";
import { sentenceToWordArr } from "../../../../Methods/TypeWriter/TypeWriter";

interface Props {
  content: string;
  postData: PostData;
}

export const Replay: FC<Props> = ({ content, postData }) => {
  const [sentence, set_sentence] = React.useState<Word[]>([]);
  const [start, setStart] = React.useState(false);
  const data = React.useRef(postData);

  const letterIndex = useRef(0);
  const wordIndex = useRef(0);
  const dataIndex = useRef(0);

  function setDelay(previousData: Character, currData: Character) {
    if (dataIndex.current === 0) {
      return postData.initialTime - data.current.characters[0].time;
    }
    return previousData.time - currData.time;
  }

  const startReplay = (delay: number) => {
    console.log(dataIndex.current);
    console.log(`Delay: ${delay}`);
    if (dataIndex.current >= data.current.characters.length) {
      return;
    }
    let temp = [...sentence];
    setTimeout(() => {
      //===================================================================
      //Correct Input
      if (
        data.current.characters[dataIndex.current].inputType ===
        InputType.visited
      ) {
        //Set new Delay Time
        delay = setDelay(
          data.current.characters[dataIndex.current],
          data.current.characters[dataIndex.current - 1]
        );
        dataIndex.current++;
        //Update Sentence
        temp[wordIndex.current].letters[letterIndex.current].wasVisited = true;
        set_sentence([...temp]);
        //Update Index
        letterIndex.current++;
        //Recursion

        startReplay(delay);
        return;
      }
      //===================================================================
      //Erased Input
      if (
        data.current.characters[dataIndex.current].inputType ===
        InputType.erased
      ) {
        //Set new Delay Time
        delay = setDelay(
          data.current.characters[dataIndex.current],
          data.current.characters[dataIndex.current - 1]
        );
        dataIndex.current++;

        //Update Sentence
        if (letterIndex.current === 0) {
          //Index is at the start of word
          wordIndex.current--;
          temp[wordIndex.current].letters.every((letter, idx) => {
            //get to the last visited word
            if (!letter.wasVisited && !letter.incorrect) {
              letterIndex.current = idx;
              return false;
            }
            //get to end of word
            letterIndex.current = temp[wordIndex.current].letters.length;
            return true;
          });
        } else if (
          temp[wordIndex.current].letters[letterIndex.current - 1].wasAdded
        ) {
          letterIndex.current--;
          //Erasing extra letters
          temp[wordIndex.current].letters.pop();
        } else {
          //Index is inside a Word
          letterIndex.current--;
          temp[wordIndex.current].letters[letterIndex.current].wasVisited =
            false;
          temp[wordIndex.current].letters[letterIndex.current].incorrect =
            false;
          temp[wordIndex.current].letters[letterIndex.current].wasAdded = false;
        }

        set_sentence([...temp]);

        //Recursion
        startReplay(delay);
        return;
      }
      //===================================================================
      //Incorrect Input
      if (
        data.current.characters[dataIndex.current].inputType === InputType.error
      ) {
        //Set new Delay Time
        delay = setDelay(
          data.current.characters[dataIndex.current],
          data.current.characters[dataIndex.current - 1]
        );
        dataIndex.current++;
        //Update Sentence
        temp[wordIndex.current].letters[letterIndex.current].wasVisited = false;
        temp[wordIndex.current].letters[letterIndex.current].incorrect = true;
        //Update Index
        letterIndex.current++;
        set_sentence([...temp]);
        //Recursion

        startReplay(delay);
        return;
      }
      //===================================================================
      //Extra input
      if (
        data.current.characters[dataIndex.current].inputType === InputType.extra
      ) {
        //Set new Delay Time
        delay = setDelay(
          data.current.characters[dataIndex.current],
          data.current.characters[dataIndex.current - 1]
        );

        //Update Index
        letterIndex.current++;
        //Update Sentence
        let newLetter = new Letter(
          data.current.characters[dataIndex.current].character,
          letterIndex.current
        );
        newLetter.wasAdded = true;
        newLetter.incorrect = true;
        dataIndex.current++;
        //Add new Letter
        temp[wordIndex.current].letters.push(newLetter);
        set_sentence([...temp]);
        //Recursion
        startReplay(delay);
        return;
      }
      //===================================================================
      //Space
      if (
        data.current.characters[dataIndex.current].inputType === InputType.space
      ) {
        //Set new Delay Time
        delay = setDelay(
          data.current.characters[dataIndex.current],
          data.current.characters[dataIndex.current - 1]
        );
        dataIndex.current++;
        set_sentence([...temp]);
        //Update Index
        letterIndex.current = 0;
        wordIndex.current++;
        //Recursion

        startReplay(delay);
        return;
      }
    }, delay);
  };

  React.useEffect(() => {
    const temp = sentenceToWordArr(content);
    set_sentence(temp);
  }, [content]);

  React.useEffect(() => {
    if (start) {
      // startReplay();
    }
  }, [start]);

  return (
    <div className="replay-container">
      <div className="buttons">
        <div className="buttons-button" onClick={() => startReplay(0)}>
          Play
        </div>
        <div className="buttons-button">Stop</div>
        <div className="buttons-button">Reset</div>
      </div>
      <div className="sentence-container">
        {sentence.map((word) => {
          return <WordContainer key={`replay-${word.idx}`} word={word} />;
        })}
      </div>
    </div>
  );
};

export default Replay;
