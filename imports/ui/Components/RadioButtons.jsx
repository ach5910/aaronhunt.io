import React from "react";
/*
 ** This is a custom Thuuz radio group design. The options are floating text
 ** with bottom borders. The selected item has white text and white border.
 ** the unseleted items have blue text with a grey border
 **
 ** Props
 **      radioOptions -  Required parameter. These are the radion button options
 **                      Each option must have a name, which is used for the label,
 **                      and an id, which is used to identify the option.
 **
 **      checked -       Required parameter. This is the id of the selected radio
 **                      option.
 **
 **      onChange -      Required parameter. This is the handler function that's called
 **                      when a radio option has been clicked and passes in the radio's
 **                      id as a parameter.
 **
 ** Example: https://codepen.io/ach5910/pen/OrOaLa
 **
 */

const RadioButtons = ({radioOptions, checked, onChange, label, className}) => (
  <form className={`input__form-container ${className || ""}`}>
    <label className="input__label shrink">{label}</label>
    <div className="input__value-container">
      <div className="radio__group">
        {radioOptions.map(radioOption => (
          <div
            onClick={() => {
              onChange(radioOption.id);
            }}
            key={`${label}-${radioOption.name}-${radioOption.id}`}
            className={`input__form-container padding input__underline ${
              radioOption.id === checked ? "input--focused " : ""
            } radio__option`}
          >
            <input
              className="radio__option-input"
              type="radio"
              id={`${label}-${radioOption.name}-${radioOption.id}`}
              value={radioOption.id}
              name={label}
              checked={checked === radioOption.id}
            />
            <label htmlFor={`${label}-${radioOption.name}-${radioOption.id}`} className={`radio__option-label `}>
              {radioOption.name || radioOption.id}
            </label>
          </div>
        ))}
      </div>
    </div>
  </form>
);

export default RadioButtons;