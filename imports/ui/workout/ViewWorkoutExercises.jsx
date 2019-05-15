import React from 'react';
import CreateExercise from './CreateExercise';
import ExerciseListItem from './ExerciseListItem';

const ViewWorkoutExercises = ({exercises, deleteExercise, logged, editExercise, activeExercises, refetch, addSet, addedSetId, finishExercise, finishedExercises, updateSetByIncrement, updateSetByInput, editSet, deleteSet, startEdittingSet, routineId}) => {
    
    renderFinishedExercise = (exercise) => (
        <ExerciseListItem
            logged={logged}
            key={exercise._id}
            startExercise={editExercise}
            exercise={exercise}
            done={true}
            viewWorkout={true}
        />
    )
    renderCreateExercise = (exercise) => (
        <CreateExercise
            logged={logged}
            key={exercise._id}
            refetch={refetch}
            exercise={exercise}
            addedSetId={addedSetId}
            activeExercise={activeExercises[exercise._id]}
            addSet={addSet}
            finishExercise={finishExercise}
            cancelExercise={deleteExercise(exercise._id, routineId)}
            updateSetByIncrement={updateSetByIncrement}
            deleteSet={deleteSet}
            viewWorkout={true}
        />
    )
    renderExercises = () => {
        return exercises.map(exercise => {
            if (activeExercises[exercise._id] != undefined){
                return renderCreateExercise(exercise)
            } else {
                return renderFinishedExercise(exercise)
            }
        })
    }
    // let completedExercises = [];
    // let currentExercises = [];
    // let remainingExercises = [];
    // exercises.forEach(exercise => {
    //     if (activeExercises[exercise._id] != undefined){
    //         currentExercises = [...currentExercises, exercise]
    //     } else if (finishedExercises.includes(exercise._id)){
    //         completedExercises = [...completedExercises, exercise];
    //     }else {
    //         remainingExercises = [...remainingExercises, exercise]
    //     }
    // })
    return (
        <React.Fragment>
            <h1 className='workout--h1'>Exercises</h1>
            {renderExercises()}
            {/* {currentExercises.length > 0 &&
                <React.Fragment>
                    <h1 className='workout--h1'>{logged ? "Logged Exercises" : "Active Exercises"}</h1>
                    {currentExercises.map(exercise => (
                        <CreateExercise
                            logged={logged}
                            key={exercise._id}
                            refetch={refetch}
                            exercise={exercise}
                            addedSetId={addedSetId}
                            activeExercise={activeExercises[exercise._id]}
                            addSet={addSet}
                            finishExercise={finishExercise}
                            deleteExercise={deleteExercise}
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
                    <h1 className='workout--h1'>{logged ? "Exercises" : "Remaining Exercises"}</h1>
                    {remainingExercises.map(exercise => (
                        <ExerciseListItem
                            logged={logged}
                            key={exercise._id}
                            startExercise={startExercise}
                            exercise={exercise}
                            done={false}
                        />
                        ))}
                    <hr/>
                </React.Fragment>
            }
            {completedExercises.length > 0 && !logged &&
                <React.Fragment>
                    <h1 className='workout--h1'>Finished Exercises</h1>
                    {completedExercises.map(exercise => (
                        <ExerciseListItem
                            logged={logged}
                            key={exercise._id}
                            startExercise={editExercise}
                            exercise={exercise}
                            done={true}
                        />
                    ))}
                </React.Fragment>
            } */}
        </React.Fragment>
    )
}

export default ViewWorkoutExercises;