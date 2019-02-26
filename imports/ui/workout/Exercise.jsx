import React from 'react';

const getORM = (activeExercise) => {
    const orm = parseInt(activeExercise.weight) * (1 + (parseInt(activeExercise.reps) / 30))
    return isNaN(orm) ? "" : orm.toFixed(2);
}

const Exercise = ({exercise, refetch, activeExercise, finishedExercises, onChange, startExercise, addSet, finishExercise}) => (
    <React.Fragment>
        {activeExercise === null && !finishedExercises.includes(exercise._id) &&
            <div className="boxed-view__box boxed-view__box--horiz">
                <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
                <button onClick={startExercise(exercise._id)} className="button button--margin">Start</button>
            </div>
        }
        {activeExercise && activeExercise._id === exercise._id &&
            <div className='boxed-view__box boxed-view__box--vert'>
                <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
                <div className="exercise--set">
                        <div className='exercise--weight'><h3>Weight</h3></div>
                        <div className="exercise--reps"><h3>Reps</h3></div>
                        <div className="exercise--orm"><h3>1RM</h3></div>
                </div>
                <ul>
                    {exercise.sets.map(set => (
                        <li className="exercise--set">
                            <div className='exercise--weight'>{set.weight}</div>
                            <div className="exercise--reps">{set.reps}</div>
                            <div className="exercise--orm">{set.orm.toFixed(2)}</div>
                        </li>
                    ))}
                </ul>
                <form noValidate className="exercise--set">
                        <input className="exercise--weight" onFocus={(e) => {e.target.select()}} type="text" onChange={onChange("weight")} value={activeExercise.weight} />
                        <input className="exercise--reps" onFocus={(e) => {e.target.select()}} type="text" onChange={onChange("reps")} value={activeExercise.reps} />
                        <div className="pseudo-input exercise--orm" value>{getORM(activeExercise)}</div>
                </form>
                <div className="button__container">
                    <button onClick={addSet(refetch)} className="button button--secondary button--margin">Add Set</button>
                    <button onClick={finishExercise(refetch)} className="button button--margin">Finish Exercise</button>
                </div>
            </div>
        }
        {activeExercise === null && finishedExercises.includes(exercise._id) && 
            <div className='boxed-view__box boxed-view__box--vert'>
                <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
                <div className="exercise--set">
                        <div className='exercise--weight'><h3>Weight</h3></div>
                        <div className="exercise--reps"><h3>Reps</h3></div>
                        <div className="exercise--orm"><h3>1RM</h3></div>
                </div>
                <ul>
                    {exercise.sets.map(set => (
                        <li className="exercise--set">
                            <div className='exercise--weight'>{set.weight}</div>
                            <div className="exercise--reps">{set.reps}</div>
                            <div className="exercise--orm">{set.orm.toFixed(2)}</div>
                        </li>
                    ))}
                </ul>
            </div>
        }
    </React.Fragment>
)

export default Exercise;