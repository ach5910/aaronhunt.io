import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
// import clips from "./clips";
import stepperProps from "./stepperProps";
import Stepper from './Stepper';



const names = ["Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie"];
class PlayerGround extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="center">
                <Stepper {...stepperProps}/>
            </div>
        )
    }
}

PlayerGround.defaultProps = {

}

PlayerGround.propTypes = {

}

export default PlayerGround;