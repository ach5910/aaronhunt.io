import React from 'react';

const Toggle = ({name, id, label, selected, onChange}) => (
    <div className={`toggle ${selected && 'toggle--selected'}`}>
      <input className="toggle__radio" type="radio" name={name} id={id} checked={selected} />
      <label onClick={onChange} className={`toggle__label ${selected && "toggle--selected"}`} htmlFor={id}>{label}</label>
    </div>
)

export default Toggle;