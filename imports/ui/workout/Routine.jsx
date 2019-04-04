import React from 'react';
import moment from 'moment';
const Routine = ({routine, viewWorkout}) => (
    <div className="boxed-view__box boxed-view__box--horiz">
        <button onClick={viewWorkout(routine)} className="button button--link-text">
            <h2 className="workout--h2" style={{marginBottom: "0px"}}>{routine.name}</h2>
        </button>
        <h2 className="workout--h2" style={{marginBottom: "0px"}}>{moment(parseInt(routine.startTime)).format("M/D/YY")}</h2>
    </div>
)

export default Routine;