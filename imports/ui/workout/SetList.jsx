import React from 'react';
import Edit from '@material-ui/icons/Edit';
import DeleteForever from '@material-ui/icons/DeleteForever';

const SetList = ({exercise, getRef = undefined, handleClick = undefined, editSetId = null, editSet, deleteSet}) => (
    <ul ref={(el) => { if(getRef !== undefined) getRef(el);}} >
        {exercise.sets.map(set => (
            <React.Fragment>
                {set._id === editSetId ?
                    <li className="exercise--set exercise--set-edit">
                        <div className="exercise--edit-set">
                            <button onClick={editSet} className="button button--link-text">Edit</button>
                            <Edit onClick={editSet} className='icon'/>
                        </div>
                        <div className="exercise--delete-set">
                            <button onClick={deleteSet} className="button button--link-text">Delete</button>
                            <DeleteForever onClick={deleteSet} className="icon"/>
                        </div>
                    </li>
                    :
                    <li className="exercise--set exercise--set__header exercise--set__list" onClick={(e) => {if (handleClick !== undefined) handleClick(set._id)}}>
                        <div className="exercise--title">{set.setNumber}</div>
                        <div className='exercise--weight'>{set.weight}</div>
                        <div className="exercise--reps">{set.reps}</div>
                        <div className="exercise--orm">{set.orm.toFixed(2)}</div>
                    </li>
                }
            </React.Fragment>
        ))}
    </ul>
)

export default SetList;