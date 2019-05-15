import React from 'react';
import ViewWorkoutExercises from './ViewWorkoutExercises';
import {getDuration} from '../../startup/client/utils';
const ViewWorkout = ({routine, addSet, cancelViewWorkout, finishedExercises, finishExercise, startExercise, activeExercises, updateSetByIncrement, deleteSet, editExercise, deleteExercise}) => (
    <React.Fragment>
        <div className="section-title">
            <h1 className="workout--h1">{routine.name} {getDuration(routine.startTime, routine.endTime)}</h1>
            <button onClick={cancelViewWorkout} className="button button--link-text">
                Return
            </button>
        </div>
        <ViewWorkoutExercises
            exercises={routine.exercises.filter(exer => finishedExercises.includes(exer._id))}
            startExercise={startExercise}
            logged={routine.logged}
            activeExercises={activeExercises}
            addSet={addSet}
            finishExercise={finishExercise}
            finishedExercises={finishedExercises}
            updateSetByIncrement={updateSetByIncrement}
            refetch={() => {}}
            deleteSet={deleteSet}
            editExercise={editExercise}
            deleteExercise={deleteExercise}
            routineId={routine._id}
        />
        <form noValidate className="boxed-view__form">
            <button onClick={cancelViewWorkout} type="submit" className="button button--margin-top">Return</button>
        </form>
    </React.Fragment>
)

export default ViewWorkout;