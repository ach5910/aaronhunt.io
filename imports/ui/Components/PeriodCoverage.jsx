import React from "react";

import {getNumberArray} from "../../startup/client/utils";

/**
 * A Custom radio component to represent period coverage selection
 * 
 * Props:
 *        numberOfPeriods   Required int
 *        selectedPeriods   Required array
 *        onChange          Require onChange function handler
 *        cumulative        Required boolean for cumulative period coverage
 *                          state
 *        label             Optional string
 */
export default class PeriodCoverage extends React.Component {
  constructor(props) {
    super(props);
  }

  inRange(i){
      const min = Math.min(...this.props.periods);
      const max = Math.max(...this.props.periods);
      return min <= i && i <= max
  }

  render() {
    const {numberOfPeriods, periods, onChange, cumulative = false, label} = this.props;
    // const highestNumber = cumulative ? getHighestNumber(selectedPeriods) : 0;
    const numberArray = getNumberArray(numberOfPeriods);
    return (
      <div className="input__form-container">
        <label className="input__label shrink">{label}</label>
        <div className="input__value-container">
          <div className="radio__group">
            {numberArray.map(i => (
              <div
                onClick={onChange(i)}
                className={`input__form-container input__underline ${
                  periods.includes(i) ? "input--focused " : ""
                } ${cumulative && this.inRange(i)? "cumulative" : ""} radio__option`}
              >
                <input
                  className="radio__option-input"
                  type="radio"
                  id={`${label}-${i}`}
                  value={i}
                  // onClick={() => {}}
                  checked={periods.includes(i)}
                />
                <label
                  className={`radio__option-label `}
                  // onClick={() => {}}
                >
                  {i}
                </label>
              </div>
            ))}
            <div
              onClick={onChange("End")}
              className={`input__form-container input__underline ${
                periods[0] === "End" ? "input--focused " : ""
              } radio__option auto`}
            >
              <input
                className="radio__option-input"
                type="radio"
                id={`${label}-auto`}
                value={"Auto"}
                // onClick={() => {}}
                checked={periods[0] === "End"}
              />
              <label
                className={`radio__option-label `}
                // onClick={() => {}}
              >
                End
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
