import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';

const ExerciseListItem = ({startExercise, exercise, done}) => {
    const {totalWeight, totalReps, topORM} = exercise.exerciseTemplate.topExerciseStats;
    return (
    <div className={`boxed-view__box boxed-view__box--${done ? 'vert' : 'horiz'}`}>
        <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
        <h2 style={{marginBottom: "0px"}}>Total Weight - {totalWeight}</h2>
        <h2 style={{marginBottom: "0px"}}>Total Reps - {totalReps}</h2>
        <h2 style={{marginBottom: "0px"}}>Top 1RM - {topORM}</h2>
        {done 
            ?
            <React.Fragment>
                <SetTitles/>
                <SetList exercise={exercise}/>
            </React.Fragment>
            :
            <button onClick={startExercise(exercise._id, exercise.previousExercise)} className="button button--margin">Start</button>
        }
    </div>)
}

export default ExerciseListItem;