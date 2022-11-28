import React, { FC } from "react";
import { ReactComponent as Percent } from "../../../../Icons/percent.svg";
import { Data } from "../../../TypeWriter/TypeWriter";
import { Text } from "../../../../Texts/Texts";
interface Props {
  data: Data;
  obj: Text;
}
const Stats: FC<Props> = ({ data, obj }) => {
  return (
    <>
      <div className={`stat`}>
        <div className="h1">wpm</div>
        <div
          className="c1"
          data-hover={`${
            Math.round(
              (data.wpm_Arr[data.wpm_Arr.length - 1] + Number.EPSILON) * 100
            ) / 100
          }`}
        >
          {Math.round(data.wpm_Arr[data.wpm_Arr.length - 1])}
        </div>
      </div>
      <div className={`stat`}>
        <div className="h1">acc</div>
        <div className="c1" data-hover={data.accuracy * 100}>
          {`${Math.round(data.accuracy * 100)}`}
          <Percent />
        </div>
      </div>
    </>
  );
};

export default Stats;
