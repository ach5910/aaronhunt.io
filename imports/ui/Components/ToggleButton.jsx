import React from "react";

/**
 * Custom toggle switch styled like the MUI Toggle Componenet 
 *  
 * Props:
 *        on            Required boolean repsenting the state of the toggle switch
 *        handleChange  Required callback functions called we the toggle state has changed
 *        style         Optional style object
 *        toggleText    Optional string used at the toggles label
 *        className     Optional string to append the the toggle class
 *        disabled      Optional boolean representing the disabled state of the toggle
 */

const ToggleButton = ({on, handleChange, style, toggleText, className, disabled}) => (
  <div className={`toggle-button ${className}`} style={style}>
    <div className={`toggle-button__container ${on ? "on" : ""} ${disabled ? "toggle-button--disabled" : ""}`}>
      <div
        onClick={() => {
          if (!disabled) handleChange();
        }}
        className={`toggle-button__switch ${on ? "on" : ""} ${disabled ? "toggle-button--disabled" : ""}`}
      />
    </div>
    <span className={`toggle-button__text ${on ? "on" : ""} ${disabled ? "toggle-button--disabled" : ""}`}>{toggleText}</span>
  </div>
);

export default ToggleButton;
