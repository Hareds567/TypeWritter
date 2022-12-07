import React, { FC, useEffect, useRef } from "react";
//
import { Letter } from "../../../../../Classes/Letter";
import { Word } from "../../../../../Classes/Word";
import { Character } from "../../../TypeWriter";

interface NewCharacter extends Character {
  idx: number;
}
interface Props {
  letter: Letter;
  filteredData: NewCharacter[];
  set_sentence: React.Dispatch<React.SetStateAction<Word[]>>;
  stopReplay: (idx?: number, time?: number) => void;
}

function useOutsideAlerter(
  ref: React.MutableRefObject<HTMLDivElement | null>,
  callback: () => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

const LetterContainer: FC<Props> = ({
  letter,
  filteredData,
  set_sentence,
  stopReplay,
}) => {
  const [multipleOptions, set_multipleOptions] = React.useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, () => set_multipleOptions(false));

  function onClick() {
    if (filteredData.length === 0) {
      return;
    }
    if (filteredData.length > 1) {
      multipleOptions ? set_multipleOptions(false) : set_multipleOptions(true);
      return;
    }
    set_sentence(filteredData[0].sentence);
    stopReplay(filteredData[0].idx, filteredData[0].time);
  }

  function options() {
    if (multipleOptions) {
      const options = filteredData.map((obj, idx) => {
        return (
          <div
            key={`filteredData-${idx}`}
            onClick={() => optionsOnClick(obj)}
            tabIndex={0}
          >
            {idx + 1}
          </div>
        );
      });
      return (
        <div className="options-container" tabIndex={0} ref={wrapperRef}>
          {options}
        </div>
      );
    }
    return <></>;
  }

  function optionsOnClick(obj: NewCharacter) {
    set_sentence(obj.sentence);
    set_multipleOptions(false);
    stopReplay(obj.idx, obj.time);
  }
  return (
    <div className="letterContainer-main" tabIndex={0}>
      <div
        className={
          letter.incorrect
            ? `incorrect2`
            : letter.wasVisited
            ? "visited2"
            : "letter-container"
        }
        onClick={onClick}
      >
        {letter.letter}
      </div>
      {options()}
    </div>
  );
};

export default LetterContainer;
