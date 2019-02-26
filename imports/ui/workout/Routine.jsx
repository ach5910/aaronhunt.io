import React from 'react';
import moment from 'moment';
const Routine = ({routine}) => (
    <div className="boxed-view__box boxed-view__box--horiz">
        <h2 style={{marginBottom: "0px"}}>{routine.name}</h2>
        <h2 style={{marginBottom: "0px"}}>{moment(routine.startTime).format("M/D/YY")}</h2>
    </div>
)

export default Routine;