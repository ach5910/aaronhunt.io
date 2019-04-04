import React from 'react';
import Routine from './Routine';

const Routines = ({routines, viewWorkout}) => (
    <React.Fragment>
        {routines && routines.map(routine => (
            <Routine viewWorkout={viewWorkout} routine={routine} />
        ))}
    </React.Fragment>
)

export default Routines;