import React from "react";
import { ReactComponent as ArrowRight } from "../../../../Icons/chevron-right.svg";
import { ReactComponent as Refresh } from "../../../../Icons/refresh.svg";
//css
import "./GraphMenu.css";

interface Props {
  nextText: any;
  repeatText: any;
}

const GraphMenu: React.FC<Props> = ({ nextText, repeatText }) => {
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
        }}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
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
