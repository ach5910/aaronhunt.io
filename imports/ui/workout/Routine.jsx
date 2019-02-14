import React from 'react';

const Routine = ({routineTemplate}) => (
    <div className="boxed-view__box boxed-view__box--vert">
        <h2>{routineTemplate.name}</h2>
        <h3>{routineTemplate._id}</h3>
    </div>
)

export default Routine;