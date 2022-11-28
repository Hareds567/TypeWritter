import React, { FC } from "react";
import { Data } from "../../../TypeWriter/TypeWriter";
import { Text } from "../../../../Texts/Texts";
interface Props {
  data: Data;
  obj: Text;
  getTestType: () => string;
}

const MoreStats: FC<Props> = ({ data, obj, getTestType }) => {
  return (
    <>
      <div className="stat2">
        <div className="h2">test type</div>
        <div className="c2">{getTestType()}</div>
      </div>
      <div className={"stat"}>
        <div className="h2">raw</div>
        <div
          className="c2"
          data-hover={`${
            Math.round(
              (data.raw_wpm_Arr[data.raw_wpm_Arr.length - 1] + Number.EPSILON) *
                100
            ) / 100
          }`}
        >{`${Math.round(data.raw_wpm_Arr[data.raw_wpm_Arr.length - 1])}`}</div>
      </div>
      <div className={`stat`}>
        <div className="h2">time</div>
        <div
          className="c2"
          data-hover={`${
            Math.round((data.totalTime + Number.EPSILON) * 100) / 100
          }s`}
        >{`${Math.round(data.totalTime)}s`}</div>
      </div>
      <div className={"stat"}>
        <div className="h2">characters</div>
        <div
          className="c2"
          data-hover={`correct, incorrect, extra, and missed`}
        >{`${data.numberOfCorrectInputs} / ${data.numberOfIncorrectInputs} / ${data.numberOfExtraInputs} / ${data.numberOfMissedInputs}`}</div>
      </div>
      <div className={"stat2"}>
        <div className="h2">source</div>
        <div className="c2">{obj.source}</div>
      </div>
    </>
  );
};

export default MoreStats;
