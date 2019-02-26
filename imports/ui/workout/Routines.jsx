import React from 'react';
import Routine from './Routine';

const Routines = ({routines}) => (
    <React.Fragment>
        {routines && routines.map(routine => (
            <Routine routine={routine} />
        ))}
    </React.Fragment>
)

export default Routines;