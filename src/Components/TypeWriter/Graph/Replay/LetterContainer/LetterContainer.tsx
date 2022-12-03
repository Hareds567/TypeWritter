import React, { FC } from "react";
//
import { Letter } from "../../../../../Classes/Letter";
interface Props {
  letter: Letter;
}

const LetterContainer: FC<Props> = ({ letter }) => {
  return (
    <div
      className={
        letter.incorrect
          ? `incorrect2`
          : letter.wasVisited
          ? "visited2"
          : "letter-container"
      }
    >
      {letter.letter}
    </div>
  );
};

export default LetterContainer;
