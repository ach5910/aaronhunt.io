import React from 'react';

export const ButtonSecondary = ({handleClick, children, className, style, disabled}) => {
    
    const removeAnimation = (e) => {
        const {target} = e;
        target.style.webkitAnimationName = "";
    }
    
    const onClick = (e) => {
        e.persist();
        const {target} = e;
        const ripple = document.createElement("div");
        ripple.classList.add('ripple');
        const removeNode = (e) => {
            const {target} = e;
            target.remove();
        }
        target.appendChild(ripple);
        ripple.addEventListener("webkitTransitionEnd", removeNode)
        const {offsetX, offsetY} = e.nativeEvent;
        ripple.setAttribute("style", `top: ${offsetY}px; left: ${offsetX}px; transform: scale(12); webkitTransform: scale(12); msTransform: scale(12); opacity: 0;`)
        target.style.webkitAnimationName = "button-click";
        handleClick(e);
    }

    return (
        <button onAnimationEnd={removeAnimation} onClick={onClick} className={`button button--secondary button--wide ${className || ""}`} disabled={disabled} style={style || {}}>
            {children}
        </button>
    )
}

export const ButtonPrimary = ({handleClick, children, className, style, disabled}) => {
    
    const removeAnimation = (e) => {
        const {target} = e;
        target.style.webkitAnimationName = "";
    }
    
    const onClick = (e) => {
        e.preventDefault();
        e.persist();
        const {target} = e;
        const ripple = document.createElement("div");
        ripple.classList.add('ripple');
        const removeNode = (e) => {
            const {target} = e;
            target.remove();
        }
        target.appendChild(ripple);
        ripple.addEventListener("webkitTransitionEnd", removeNode)
        const {offsetX, offsetY} = e.nativeEvent;
        ripple.setAttribute("style", `background-color: rgba(255, 255, 255, 0.2); top: ${offsetY}px; left: ${offsetX}px; transform: scale(12); webkitTransform: scale(12); msTransform: scale(12); opacity: 0;`)
        target.style.webkitAnimationName = "button-click";
        handleClick(e);
    }

    return (
        <button onAnimationEnd={removeAnimation} onClick={onClick} className={`button button--wide ${className || ""}`} disabled={disabled} style={style || {}}>
            {children}
        </button>
    )
}