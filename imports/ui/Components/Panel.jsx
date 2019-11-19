import React from "react";

const Panel = ({description, action, children}) => (
  <div className="expansion-panel" style={{overflow: "visible"}}>
    <div className="expansion-summary panel expansion-summary--visible">
      <span className="expansion-panel__description">{`${description}\u00A0/\u00A0`}</span>
      <span className="expansion-panel__action">{action}</span>
    </div>
    <div className="expansion-detail expansion-detail--visible" style={{overflow: "visible"}}>
      <hr />
      {children}
    </div>
  </div>
);

export default Panel;
