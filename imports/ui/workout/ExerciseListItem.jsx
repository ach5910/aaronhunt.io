import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';
import moment from 'moment';
import { getDuration } from '../../startup/client/utils';

const ExerciseListItem = ({startExercise, exercise, done}) => {
    //const {totalWeight, totalReps, topORM} = exercise.exerciseTemplate.topExerciseStats;
    let exerciseTime = getDuration(exercise.startTime, exercise.endTime);
    // const h = dur.hours();
    // const m  = dur.minutes();
    // const s = dur.seconds()
    // const {hours, minutes, seconds} = dur._data;
    // console.log('dur', dur);
    // console.log('hours minutes seconds', hours, minutes, seconds);
    // console.log('end start',end, start, moment(exercise.endTime, "x").diff(moment(exercise.startTime, "x")))
    return (
    <div className={`boxed-view__box boxed-view__box--${done ? 'vert' : 'horiz'}`}>
        <h2 className="workout--h2" style={{marginBottom: "0px"}}>{exercise.name} {exerciseTime}</h2>
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
            <button onClick={startExercise(exercise._id, exercise.previousExercise)} className="button button--margin">Start</button>
        }
    </div>)
}

export default ExerciseListItem;