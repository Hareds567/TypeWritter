import React, { FC } from "react";
//css
import "./Menu.css";
//icons
// import { ReactComponent as Quote } from "../../Icons/quote-left-solid.svg";
import { Text, length } from "../../Texts/Texts";
import {
  getRandomTextByType,
  getRandomText,
} from "../../Methods/TypeWriter/TypeWriter";

interface Props {
  set_menu: React.Dispatch<
    React.SetStateAction<{
      testType: number;
      mode: number;
    }>
  >;
  set_content: React.Dispatch<React.SetStateAction<Text>>;
}
export function getLabel() {
  const temp = localStorage.getItem("menu");
  let final = { activeLabel: 0, type: 0 };
  if (temp) {
    const obj = JSON.parse(temp);
    final.activeLabel = obj.activeLabel as number;
    final.type = obj.type as number;
  }
  return final;
}

const Menu: FC<Props> = ({ set_menu, set_content }) => {
  const [activeLabel, set_activeLabel] = React.useState(getLabel().activeLabel);
  const [type, set_type] = React.useState(getLabel().type);
  const container = React.useRef<HTMLDivElement>(null);

  //====================================================================

  function onClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) {
    e.preventDefault();
    //Get content based on type
    id === 0
      ? set_content(getRandomText())
      : set_content(getRandomTextByType(id));
    //Update Active Label
    set_activeLabel(id);
    //Store current Settings
    const obj = { activeLabel: id, type: type };
    localStorage.setItem("menu", JSON.stringify(obj));
  }

  //====================================================================

  return (
    <div className={`menu-container`} ref={container} id={`menu-container`}>
      <div
        className={`menu-subContainer1`}
        id={`menu-subContainer1`}
        tabIndex={0}
      >
        <div className={`menu-item ${"isActive"}`} onClick={() => set_type(0)}>
          quote
        </div>
        <div className="spacer"></div>
        <div
          className={`menu-item ${activeLabel === 0 ? "isActive" : undefined}`}
          onClick={(e) => onClick(e, 0)}
        >
          all
        </div>
        <div
          className={`menu-item ${activeLabel === 1 ? "isActive" : undefined}`}
          onClick={(e) => onClick(e, length.short)}
        >
          short
        </div>
        <div
          className={`menu-item ${activeLabel === 2 ? "isActive" : undefined}`}
          onClick={(e) => onClick(e, length.medium)}
        >
          medium
        </div>
        <div
          className={`menu-item ${activeLabel === 3 ? "isActive" : undefined}`}
          onClick={(e) => onClick(e, length.long)}
        >
          long
        </div>
      </div>
    </div>
  );
};

export default Menu;
