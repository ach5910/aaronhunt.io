import React from 'react';
import Edit from '@material-ui/icons/Edit';

const Exercise = ({exerciseTemplate, editExerciseTemplate}) => (
    <div className="boxed-view__box boxed-view__box--horiz">
        <h2 style={{marginBottom: "0px"}}>{exerciseTemplate.name}</h2>
        <div className="item__icons">
            <Edit onClick={editExerciseTemplate(exerciseTemplate)} className="icon" />
        </div>
    </div>
)

export default Exercise;