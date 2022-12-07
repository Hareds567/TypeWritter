import React, { FC } from "react";
//
import { Word } from "../../../../../Classes/Word";
import { PostData } from "../../../TypeWriter";
import { Character } from "../../../TypeWriter";
//
import LetterContainer from "../LetterContainer/LetterContainer";
interface Props {
  word: Word;
  postData: PostData;
  set_sentence: React.Dispatch<React.SetStateAction<Word[]>>;
  stopReplay(index?: number, time?: number): void;
}

interface NewCharacter extends Character {
  idx: number;
}

const WordContainer: FC<Props> = ({
  word,
  stopReplay,
  postData,
  set_sentence,
}) => {
  function printLetters() {
    const arr = word.letters.map((letter, idx) => {
      let temp: NewCharacter[] = [];

      postData.characters.forEach((obj, idx2) => {
        if (idx === obj.letterIdx && word.idx === obj.wordIdx) {
          let a = JSON.parse(JSON.stringify(obj)) as NewCharacter;
          a.idx = idx2;
          temp.push(a);
        }
      });

      return (
        <LetterContainer
          key={`${word.idx}-${letter.id}`}
          letter={letter}
          filteredData={temp}
          set_sentence={set_sentence}
          stopReplay={stopReplay}
        />
      );
    });
    return arr;
  }

  return <div className="word">{printLetters()}</div>;
};

export default WordContainer;
