import React from 'react';

const SetList = ({exercise, getRef = undefined}) => (
    <ul ref={(el) => { if(getRef !== undefined) getRef(el);}} >
        {exercise.sets.map(set => (
            <li className="exercise--set">
                <div className='exercise--weight'>{set.weight}</div>
                <div className="exercise--reps">{set.reps}</div>
                <div className="exercise--orm">{set.orm.toFixed(2)}</div>
            </li>
        ))}
    </ul>
)

export default SetList;