import React from "react";
import {safeInject} from "../../startup/client/utils";
import ExpandMore from "@material-ui/icons/ExpandMore";

/*
 ** Custom Select component that mimicks the design and functionality of MUI
 ** Select Component
 **
 ** Props
 **      label       Required ParameterThe label placed in the upper left corner
 **                  intended to describe the input.
 **      value       Required Parameter. The value of the selected option(s). This
 **                  can be a string or a list depending on if multiple is true.
 **      placeholder Optional Parameter. The placeholder text rendered in the input
 **                  box before any option has been selected intended as a hint
 **      children    Required Parameter. Renders the child SelectMenu created by the
 **                  user when prompted.
 **      className   Option Parameter. Allows of custom classes to be applied.
 **      multiple    Option Parameter. Boolean value that when true. The SelectMenu
 **                  and the SelectInput allow for and render mutiple options.
 **      renderValue Required Parameter. The render function for the selected input
 **                  passed in by the user.
 **      disabled    Optional boolean Param. If true the input is effectively disabled
 **                  meaning that it is rendered a disabled-like color and is un-
 **                  responsive to click events.
 **      fixedList   Optional boolean Param. If true the selection menu will be fixed
 **                  position to the window oppose to absolute to the select input. This
 **                  is used to when the select menu render is being obstructed by a
 **                  parent element whose overflow is set to hidden.
 **      tooltip     Option String Param. Helper text that appears as a modal when the
 **                  label is clicked.
 **
 ** Example: https://codepen.io/ach5910/pen/vvWQpQ
 **
 **
 */

export default class SelectInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
    this.dropDownMenu = React.createRef();
    this.inputContainer = React.createRef();
  }


  showMenu = event => {
    event.preventDefault();
    // Only show the SelectListMenu if input is not disbaled
    if (!this.props.disabled) {
      this.setState({showMenu: true}, () => {
        document.addEventListener("click", this.closeMenu);
        document.addEventListener("touchstart", this.closeMenu);
      });
    }
  };

  closeMenu = event => {
    if (this.props.multiple) {
      if (!this.dropDownMenu.current.contains(event.target)) {
        this.setState({showMenu: false}, () => {
          document.removeEventListener("click", this.closeMenu);
          document.removeEventListener("touchstart", this.closeMenu);
        });
        // If multiple selection is true, always scroll to the bottom of the selected list
        // to show the most recent selection made.
        this.inputContainer.current.scrollTop = this.inputContainer.current.scrollHeight;
      }
    } else if (event.type !== "touchstart" || !this.dropDownMenu.current.contains(event.target)) {
      this.setState({showMenu: false}, () => {
        document.removeEventListener("click", this.closeMenu);
        document.removeEventListener("touchstart", this.closeMenu);
      });
    }
  };

  // To position a menu ontop of a parent component that has overflow = hidden,
  // we need to position the element fixed to the root node and offset by the top and left
  // params of the parent element
  getFixedListPosition = fixedList => {
    if (!fixedList || !this.inputContainer || !this.inputContainer.current) return {};
    const {top, left, width} = this.inputContainer.current.getBoundingClientRect();
    return {top, left, minWidth: width};
  };

  render() {
    const {
      label,
      value,
      placeholder,
      children,
      className,
      multiple,
      renderValue,
      labelClass,
      tooltip,
      fixedList = false,
      containerStyle = {},
      inputStyle = {},
      disabled,
      listStyle,
      listClass = false,
      inputUnits = false,
    } = this.props;
    const {showTooltip} = this.state;
    const fixedListStyle = this.getFixedListPosition(fixedList);
    const displayMenu = this.state.showMenu && children !== undefined;
    const shrinkLabel = value !== "" || placeholder !== undefined;
    return (
      <div
        className={`input__form-container select ${safeInject(disabled, "", "disabled")} ${safeInject(
          displayMenu,
          "",
          "selected"
        )} ${safeInject(className)}`}
      >
        <label className={`input__label ${safeInject(shrinkLabel, "", "shrink")} `}>
          {label}
        </label>
        <div className={`input__value-container  input__underline`} style={containerStyle}>
          <div className="input__select-input" style={inputStyle} ref={this.inputContainer} onClick={this.showMenu}>
            {multiple ? (
              value.length === 0 ? (
                <span className="select__placeholder">{placeholder}</span>
              ) : (
                value.map(selected => renderValue(selected))
              )
            ) : value === "" ? (
              <span className="select__placeholder">{placeholder}</span>
            ) : (
              renderValue(value)
            )}
          </div>
        </div>
        {inputUnits && <span className="input__units">{inputUnits}</span>}
        <div
          className={`select__list ${safeInject(fixedList, "", "fixed")} ${safeInject(listClass, "")}`}
          style={fixedList ? fixedListStyle : listStyle || {}}
          ref={this.dropDownMenu}
        >
          {children}
        </div>
      </div>
    );
  }
}

/*
 ** Custom component that can be used for rendering list items in the select menu
 **
 ** Props
 **      selected        Required Parameter. Boolean value that represent if this item
 **                      is a selected item
 **      value           Required Paremeter. This is the rendered text of the item
 **      onChange        Required Parameter. Handler function for when the item is clicked
 **      getRef          Optional Paramenter. Function passed in a parent component used to
 **                      obtain reference to this list item.
 **
 */

export class SelectListItem extends React.Component {
  constructor(props) {
    super(props);
    this.listItem = React.createRef();
  }
  componentDidMount = () => {
    if (this.props.getRef) {
      this.props.getRef(this.listItem);
    }
  };
  render() {
    const {selected, onChange, value, className} = this.props;
    return (
      <div
        ref={this.listItem}
        className={`select__list-item ${selected ? "selected" : ""} ${safeInject(className, "")}`}
        onClick={onChange}
      >
        {value}
      </div>
    );
  }
}

/*
 **  Custom menu item component used for nested menus in select option lists
 **
 **  Props:
 **          selected:   Required Parameter. Boolean value that represents if
 **                      the menu has been selected.
 **          value:      Required Paremeter. The display text for the nested menu
 **          onChange:   Required Parameter. Function passed down that is called when
 **                      the menu item has been clicked
 **
 **  Example: https://codepen.io/ach5910/pen/oJQzgO
 */

export const MenuItem = ({selected, value, onChange, className}) => (
  <div className={`menu-item ${safeInject(className)}`} onClick={onChange}>
    {value}
    <ExpandMore onClick={onChange} className={`menu-item__arrow ${safeInject(selected, "", "selected")}`} />
  </div>
);

/*
 ** Custom component that can be used to render selected option in the select input field
 **
 ** Props
 **      selected        Required Parameter. The rendered text of the selected item
 */

export const SelectItem = ({selected, className = false}) => <div className={`select__selected-item ${className || ""}`}>{selected}</div>;
