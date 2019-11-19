import React from "react";
import {strPadLeft} from "../../startup/client/utils";

export const AUTO = "Auto";
export const MAX = "Max";

export default class TargetDuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialLoad: true,
      duration: 0,
      numOffset: 0,
      trackLeftOffset: 0,
      trackRightOffset: 0,
      thumbOffset: 0,
      isActive: false
    };
    this.rect = React.createRef();
    this.sliderValue = React.createRef();
    this.thumb = React.createRef();
    this.numberBox = React.createRef();
  }

  calculateOffsets = (value, maxValue) => {
    // slider track width
    const width = this.sliderValue.current.clientWidth;
    // thumb width aka slider knob
    let thumbWidth = this.thumb.current.offsetWidth;
    // Duration label width
    let numWidth = this.numberBox.current.clientWidth;

    // Provide fallback values for instances when we lose, or haven't yet
    // initialized a reference to the slider thumb and/or number box.
    // This ternary condition should only be false when there is
    // no refernce to the dom node resulting in a width === 0, but
    // we'll safe gaurd these values at their expected min widths
    thumbWidth = thumbWidth >= 15 ? thumbWidth : 15;
    numWidth = numWidth >= 30 ? numWidth : 30;

    //Get the size of the track to the left of the slider thumb
    const trackLeftOffset = width - width * (value / maxValue);
    //Get the size of the track to the right of the slider thumb
    const trackRightOffset = width * (value / maxValue);
    //Get the offset of the thumbs x location starting from the left most point
    // of the track and with respect to the left edge of the thumb
    const thumbOffset = trackRightOffset - thumbWidth * (value / maxValue);
    //Get off offset of the duration label above the slider. Left offset
    const numOffset = thumbOffset - numWidth / 4;
    this.setState({
      initialLoad: false,
      duration: value,
      numOffset,
      trackLeftOffset,
      trackRightOffset,
      thumbOffset,
      isActive: true
    });
  };

  componentDidMount = () => {
    const {duration, maxValue} = this.props;
    // Don't update for Auto
    if (this.props.duration && this.props.duration !== AUTO) {
      // If duration is equal to the string value for MAX, return
      // the int value, or return the current int duration
      let value = duration === MAX ? maxValue : duration;
      this.calculateOffsets(value, maxValue);
    }
  };

  onDurationChange = e => {
    const {value} = e.target;
    const {maxValue} = this.props;
    this.calculateOffsets(value, maxValue);
    this.props.onChange(value === `${this.props.maxValue}` ? MAX : value);
  };

  onChangeAuto = () => {
    this.setState({isActive: false});
    this.props.onChange(AUTO);
  };

  getTimeFormat = () => {
    const minutes = Math.floor(this.state.duration / 60);
    const seconds = this.state.duration % 60;
    const clockTime = `${strPadLeft(minutes, "0", 2)}:${strPadLeft(seconds, "0", 2)}`;
    return this.state.duration === `${this.props.maxValue}` ? "Max" : clockTime;
  };

  render() {
    const displayTime = this.getTimeFormat();

    const {isActive, initialLoad, label} = this.state;
    return (
      <div className="highlight-rules-form--target-duration target-duration-input">
        <div className="input__form-container slider">
          <label className="input__label shrink">{label}</label>
          <div ref={this.rect} className="input__value-container">
            <div className={`select-duration-hint ${initialLoad ? "initialLoad" : ""}`}>Select target duration</div>
            <input
              ref={this.sliderValue}
              className={`slider__range ${this.state.isActive ? "disabled" : ""} ${initialLoad ? "initialLoad" : ""} `}
              type="range"
              min="30"
              max={this.props.maxValue}
              step="5"
              value={this.state.duration}
              onChange={this.onDurationChange}
            />
            <label
              ref={this.numberBox}
              style={{left: this.state.numOffset + "px"}}
              className={`slider__value ${this.state.isActive ? "" : "disabled"} ${initialLoad ? "initialLoad" : ""}`}
            >
              {displayTime}
            </label>
            <div
              className={`slider__track-left ${this.state.isActive ? "" : "disabled"}`}
              style={{right: this.state.trackLeftOffset + "px"}}
            />
            <div
              className={`slider__track-right ${this.state.isActive ? "" : "disabled"}`}
              style={{left: this.state.trackRightOffset + "px"}}
            />
            <div
              className={`thumb ${this.state.isActive ? "" : "disabled"} ${initialLoad ? "initialLoad" : ""}`}
              ref={this.thumb}
              style={{left: this.state.thumbOffset + "px"}}
            />
          </div>
        </div>

        <div
          onClick={this.onChangeAuto}
          className={`input__form-container input__underline ${
            !isActive ? "input--focused " : ""
          } radio__option auto-option`}
        >
          <input
            className="radio__option-input"
            type="radio"
            id={`Auto-auto`}
            value={"Auto"}
            onClick={() => {}}
            checked={!isActive}
          />
          <label className={`radio__option-label radio__option-auto-label`} onClick={() => {}}>
            Auto
          </label>
        </div>
      </div>
    );
  }
}
