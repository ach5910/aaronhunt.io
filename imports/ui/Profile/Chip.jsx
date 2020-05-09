import React from 'react';
import PropTypes from 'prop-types';
import { rippleClick } from '../../startup/client/utils';
import classNames from 'classnames';


const Chip = ({selected, children, onClick, tab=false, className}) => {
    const baseClass = tab ? "chip-tab" : "chip";
    return(
        <div onClick={rippleClick(onClick)} className={classNames(baseClass, {[`${baseClass}--selected`]: selected,[className]: className})}>
            {children}
        </div>
    )
}

Chip.defaultProps = {

}

Chip.propTypes = {

}

export default Chip;