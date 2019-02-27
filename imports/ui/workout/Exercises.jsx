import React from 'react';
import CreateExercise from './CreateExercise';
import ExerciseListItem from './ExerciseListItem';

const Exercises = ({exercises, activeExercise, startExercise, refetch, addSet, finishExercise, finishedExercises, onChange}) => (
    <React.Fragment>
        {exercises.map(exercise => (
            <React.Fragment>
                {activeExercise === null ?
                    <ExerciseListItem
                        startExercise={startExercise}
                        exercise={exercise}
                        done={finishedExercises.includes(exercise._id)}
                    />
                    : activeExercise._id === exercise._id &&
                    <CreateExercise
                        refetch={refetch}
                        exercise={exercise}
                        activeExercise={activeExercise}
                        addSet={addSet}
                        finishExercise={finishExercise}
                        onChange={onChange}
                    />
                }
            </React.Fragment>
        ))}
    </React.Fragment>
)

export default Exercises;