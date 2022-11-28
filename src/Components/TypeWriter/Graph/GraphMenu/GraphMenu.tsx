import React, { SetStateAction } from "react";
import { ReactComponent as ArrowRight } from "../../../../Icons/chevron-right.svg";
import { ReactComponent as Refresh } from "../../../../Icons/refresh.svg";
//css
import "./GraphMenu.css";

interface Props {
  nextText: any;
  repeatText: any;
  set_currenLocation: React.Dispatch<SetStateAction<number>>;
}

const GraphMenu: React.FC<Props> = ({
  nextText,
  repeatText,
  set_currenLocation,
}) => {
  return (
    <div className={`graphMenu-container`}>
      <div
        className={`graphMenu-menuItem`}
        hover-data={`next test`}
        tabIndex={0}
        onClick={() => {
          nextText();
        }}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            nextText();
            set_currenLocation(1);
          }
        }}
      >
        <ArrowRight />
      </div>
      <div
        className={`graphMenu-menuItem`}
        hover-data={`repeat test`}
        tabIndex={0}
        onClick={() => {
          repeatText();
          set_currenLocation(2);
        }}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            set_currenLocation(2);
            repeatText();
          }
        }}
      >
        <Refresh />
      </div>
    </div>
  );
};

export default GraphMenu;
