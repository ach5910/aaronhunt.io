import React from 'react';

export const ButtonSecondary = ({handleClick, children}) => {
    
    const removeAnimation = (e) => {
        const {target} = e;
        target.style.webkitAnimationName = "";
    }
    
    const onClick = (e) => {
        e.persist();
        const {target} = e;
        target.style.webkitAnimationName = "button-click";
        handleClick(e);
    }

    return (
        <button onAnimationEnd={removeAnimation} onClick={onClick/*this.updateRecordMethod('log')*/} className="button button--secondary button--wide">
            {children}
        </button>
    )
}