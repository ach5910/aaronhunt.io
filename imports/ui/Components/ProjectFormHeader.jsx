import React from "react";
import ExpandMore from "@material-ui/icons/ExpandMore";

const ProjectFormHeader = ({handleClick, title = ""}) => (
  <div className="project-form-header">
    <ExpandMore onClick={handleClick} className="project-form-header__icon" />
    <span className="project-form-header__title">Project Details:</span>
    <span className="project-form-header__name">{title}</span>
  </div>
);

export default ProjectFormHeader;
