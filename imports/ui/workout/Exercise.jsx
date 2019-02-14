import React from 'react';

const Exercise = ({exerciseTemplate}) => (
    <div className="boxed-view__box boxed-view__box--vert">
        <h2>{exerciseTemplate.name}</h2>
        <h2>{exerciseTemplate._id}</h2>
    </div>
)

export default Exercise;