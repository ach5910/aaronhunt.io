import React from 'react';

const RadioGroup = ({values = [], selected, handleClick, groupName, style, groupId}) => (
    <div className="radio-group" style={style || {}}>
        <div className="radio-group--label">{groupName} Increment</div>
        {values.map((value, idx) => (
            <React.Fragment key={`${groupId}-${idx}`}>
                <input 
                    id={`${groupId}-${idx}`}
                    type="radio"
                    value={value}
                    name={groupId}
                    checked={value === selected}/>
                <label 
                    onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleClick(value)}}
                    htmlFor={`${groupId}-${idx}`} 
                    value={value}
                >
                    {value}
                </label>
            </React.Fragment>))
        }
    </div>
)

export default RadioGroup;