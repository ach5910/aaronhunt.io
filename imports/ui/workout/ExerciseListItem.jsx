import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';
import EditIcon from '../Components/EditIcon';
import { getDuration } from '../../startup/client/utils';
import ViewWorkout from './ViewWorkout';

const ExerciseListItem = ({logged, startExercise, exercise, done, viewWorkout}) => {
    //const {totalWeight, totalReps, topORM} = exercise.exerciseTemplate.topExerciseStats;
    let exerciseTime = "";
    if (!logged){
        exerciseTime = getDuration(exercise.startTime, exercise.endTime);
    }
    // const h = dur.hours();
    // const m  = dur.minutes();
    // const s = dur.seconds()
    // const {hours, minutes, seconds} = dur._data;
    // console.log('dur', dur);
    // console.log('hours minutes seconds', hours, minutes, seconds);
    // console.log('end start',end, start, moment(exercise.endTime, "x").diff(moment(exercise.startTime, "x")))
    return (
    <div className={`boxed-view__box boxed-view__box--${done ? 'vert' : 'horiz'}`}>
        <div className='section-title'>
            <h2 className="workout--h2" style={{marginBottom: "0px"}}>{exercise.name}{exerciseTime !== "" ? `:${exerciseTime}` : ""}</h2>
            {done && <EditIcon clickHandler={startExercise(exercise, viewWorkout)} />}
        </div>
        {/* <h2 className="workout--h2" style={{marginBottom: "0px"}}>Total Weight - {totalWeight}</h2>
        <h2 className="workout--h2" style={{marginBottom: "0px"}}>Total Reps - {totalReps}</h2>
        <h2 className="workout--h2" style={{marginBottom: "0px"}}>Top 1RM - {topORM}</h2> */}
        {done 
            ?
            <React.Fragment>
                <SetTitles/>
                <SetList exercise={exercise}/>
            </React.Fragment>
            :
            <button onClick={startExercise(exercise._id, exercise.previousExercise)} className="button button--margin">{logged ? "Log" : "Start"}</button>
        }
    </div>)
}

export default ExerciseListItem;