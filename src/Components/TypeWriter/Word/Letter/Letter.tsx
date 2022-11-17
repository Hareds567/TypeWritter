import React from "react";
//Classes
import { Letter as LetterObj } from "../../../../Classes/Letter";
interface Props {
  letterObj: LetterObj;
  wordId: number;
  active_letter_indx: { word_idx: number; letter_idx: number };
  isDeleting: Boolean;
}
const Letter: React.FC<Props> = ({
  letterObj,
  wordId,
  active_letter_indx,
  isDeleting,
}) => {
  function carol() {
    if (
      active_letter_indx.word_idx === wordId &&
      active_letter_indx.letter_idx - 1 === letterObj.id
    ) {
      return (
        <div className={`${!isDeleting ? "verticalLine" : "isDeleting"}`} />
      );
    }
    if (
      active_letter_indx.word_idx === wordId &&
      active_letter_indx.letter_idx === 0 &&
      letterObj.id === 0
    ) {
      return <div className={`verticalLine start`} />;
    }
    return <></>;
  }

  return (
    <>
      <div
        className={
          letterObj.incorrect
            ? "incorrect "
            : letterObj.wasVisited
            ? "visited"
            : "letter"
        }
      >
        {carol()}
        {letterObj.letter}
      </div>
    </>
  );
};
export default Letter;
