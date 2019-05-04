import React from 'react';

const SetTitles = ({className = ""}) => (
    <React.Fragment>
        <div className={`exercise--set exercise--set__header ${className}`}>
            <h3 className="workout--h3 exercise--title">Set</h3>
            <h3 className='workout--h3 exercise--weight'>Weight</h3>
            <h3 className="workout--h3 exercise--reps">Reps</h3>
            <h3 className="workout--h3 exercise--orm">1RM</h3>
        </div>
        <hr style={{margin: "0px"}}/>
    </React.Fragment>
)

export default SetTitles;