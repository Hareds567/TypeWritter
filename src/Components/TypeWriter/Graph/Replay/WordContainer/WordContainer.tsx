import React, { FC } from "react";
//
import { Word } from "../../../../../Classes/Word";
import Letter from "../../../Word/Letter/Letter";
//
import LetterContainer from "../LetterContainer/LetterContainer";
interface Props {
  word: Word;
}

const WordContainer: FC<Props> = ({ word }) => {
  return (
    <div className="word">
      {word.letters.map((letter) => {
        return (
          <LetterContainer key={`${word.idx}-${letter.id}`} letter={letter} />
        );
      })}
    </div>
  );
};

export default WordContainer;
