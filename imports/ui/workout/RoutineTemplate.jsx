import React from 'react';
import Edit from '@material-ui/icons/Edit';
import DeleteForever from '@material-ui/icons/DeleteForever';

const RoutineTemplate = ({routineTemplate, deleteRoutineTemplate, editRoutineTemplate}) => (
    <div className="boxed-view__box boxed-view__box--horiz">
        <h2 style={{marginBottom: "0px"}}>{routineTemplate.name}</h2>
        <div className="item__icons">
            <Edit onClick={editRoutineTemplate(routineTemplate)} className="icon" />
            <DeleteForever onClick={deleteRoutineTemplate(routineTemplate)} className="icon" />
        </div>
    </div>
)

export default RoutineTemplate;