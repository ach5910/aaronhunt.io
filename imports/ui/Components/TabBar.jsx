import React from 'react';

const TabBar = ({toggleView, selectedView}) => {
    onClick = (view) => (e) => {
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
        toggleView(view)(e);
    }

    return (
        <div className="tab-bar-container">
            <div className="tab-bar">
                <div className="tab" id="Calendar" onClick={onClick("Calendar View")}>Calendar</div>
                <div className="tab" id="List" onClick={onClick("List View")}>List</div>
                <div className="indicator" style={{transform: selectedView === "Calendar View" ? "translateX(0px)" : "translateX(8rem)"}}></div>
            </div>
        </div>
    )
}

export default TabBar;