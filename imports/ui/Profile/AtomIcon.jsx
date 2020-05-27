import React from "react";
import PropTypes from "prop-types";

const AtomIcon = ({style={}, className, bind}) => (
    <svg {...bind} className={cn("atom", {[className]: className})} style={style} viewBox="0 0 100 100">
        <g >
            <ellipse
                className="electron--back"
                cx="50"
                cy="50"
                rx="50"
                ry="14"
                strokeLinecap="round"
                strokeDasharray="0, 217.32"
            />
        </g>
        <g  className="center-nuclei" transform="rotate(60)">
            <ellipse
                className="electron--back electron--back-2 "
                cx="50"
                cy="50"
                rx="50"
                ry="14"
                strokeLinecap="round"
                strokeDasharray="0, 217.32"
            />
        </g>
        <g  className="center-nuclei" transform="rotate(120)">
            <ellipse
                className="electron--back electron--back-3"
                cx="50"
                cy="50"
                rx="50"
                ry="14"
                strokeLinecap="round"
                strokeDasharray="0, 217.32"
            />
        </g>
        <circle className="nucleus" cx="50" cy="50" r="25" />
        <g id="shell" transform-origin="50 50">
            <ellipse
                className="electron"
                cx="50"
                cy="50"
                rx="50"
                ry="14"
                strokeLinecap="round"
                strokeDasharray="0, 217.32"
            />
            <ellipse className="ring" strokeDasharray="176,44" cx="50" cy="50" rx="50" ry="14" />
        </g>
        <g className="center-nuclei" transform="rotate(60)">
            <ellipse
                className="electron electron-2"
                cx="50"
                cy="50"
                rx="50"
                ry="14"
                strokeLinecap="round"
                strokeDasharray="0, 217.32"
            />
            <ellipse className="ring" strokeDasharray="176,44" cx="50" cy="50" rx="50" ry="14" />
        </g>
        <g className="center-nuclei" transform="rotate(120)" >
            <ellipse
                className="electron electron-3"
                cx="50"
                cy="50"
                rx="50"
                ry="14"
                strokeLinecap="round"
                strokeDasharray="0, 217.32"
            />
            <ellipse className="ring" strokeDasharray="176,44" cx="50" cy="50" rx="50" ry="14" />
        </g>
    </svg>
);

AtomIcon.defaultProps = {};

AtomIcon.propTypes = {};

export default AtomIcon;
