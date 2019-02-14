import React from 'react';

const Chip = ({name, value, deleteable, onDelete, handleClick}) => (
    <span className="chip">
      <div
        className="chip__container"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          handleClick(value)
        }}
      >
        <label className="chip__label">{name}</label>
        {deleteable && (
          <div
            className="chip__delete-icon"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(value);
            }}
          />
        )}
      </div>
    </span>
);

export default Chip;