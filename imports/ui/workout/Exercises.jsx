import React from 'react';
import CreateExercise from './CreateExercise';
import ExerciseListItem from './ExerciseListItem';

const Exercises = ({exercises, cancelExercise, activeExercises, startExercise, refetch, addSet, addedSetId, finishExercise, finishedExercises, updateSetByIncrement, updateSetByInput, editSet, deleteSet, startEdittingSet}) => {
    let completedExercises = [];
    let currentExercises = [];
    let remainingExercises = [];
    exercises.forEach(exercise => {
        if (finishedExercises.includes(exercise._id)){
            completedExercises = [...completedExercises, exercise];
        } else if (activeExercises[exercise._id] != undefined){
            currentExercises = [...currentExercises, exercise]
        } else {
            remainingExercises = [...remainingExercises, exercise]
        }
    })
    return (
        <React.Fragment>
            {currentExercises.length > 0 &&
                <React.Fragment>
                    <h1 className='workout--h1'>Active Exercises</h1>
                    {currentExercises.map(exercise => (
                        <CreateExercise
                        key={exercise._id}
                        refetch={refetch}
                        exercise={exercise}
                        addedSetId={addedSetId}
                        activeExercise={activeExercises[exercise._id]}
                        addSet={addSet}
                        finishExercise={finishExercise}
                        cancelExercise={cancelExercise}
                        updateSetByIncrement={updateSetByIncrement}
                        updateSetByInput={updateSetByInput}
                        editSet={editSet}
                        deleteSet={deleteSet}
                        startEdittingSet={startEdittingSet}
                        />
                        ))}
                    <hr/>
                </React.Fragment>
            }
            {remainingExercises.length > 0 &&
                <React.Fragment>
                    <h1 className='workout--h1'>Remaining Exercises</h1>
                    {remainingExercises.map(exercise => (
                        <ExerciseListItem
                        key={exercise._id}
                        startExercise={startExercise}
                        exercise={exercise}
                        done={false}
                        />
                        ))}
                    <hr/>
                </React.Fragment>
            }
            {completedExercises.length > 0 && 
                <React.Fragment>
                    <h1 className='workout--h1'>Finished Exercises</h1>
                    {completedExercises.map(exercise => (
                        <ExerciseListItem
                            key={exercise._id}
                            startExercise={startExercise}
                            exercise={exercise}
                            done={true}
                        />
                    ))}
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default Exercises;