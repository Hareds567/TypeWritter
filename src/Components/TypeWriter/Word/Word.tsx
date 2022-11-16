import React, { FC } from "react";
//Classes
import { Word as WordObj } from "../../../Classes/Word";
//Components
import Letter from "./Letter/Letter";

interface Props {
  word: WordObj;
  active_letter_indx: { word_idx: number; letter_idx: number };
  isDeleting: boolean;
}

export const Word: FC<Props> = ({ word, active_letter_indx, isDeleting }) => {
  return (
    <div className={`word ${word.isBugged ? "isBugged" : ""}`}>
      {word.letters.map((letter) => {
        return (
          <Letter
            key={`${word.idx}-${letter.id}`}
            letterObj={letter}
            wordId={word.idx}
            active_letter_indx={active_letter_indx}
            isDeleting={isDeleting}
          />
        );
      })}
    </div>
  );
};

export default Word;
