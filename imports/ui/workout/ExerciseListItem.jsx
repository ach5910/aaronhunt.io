import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';

const ExerciseListItem = ({startExercise, exercise, done}) => (
    <div className={`boxed-view__box boxed-view__box--${done ? 'vert' : 'horiz'}`}>
        <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
        {done 
            ?
            <React.Fragment>
                <SetTitles/>
                <SetList exercise={exercise}/>
            </React.Fragment>
            :
            <button onClick={startExercise(exercise._id)} className="button button--margin">Start</button>
        }
    </div>
)

export default ExerciseListItem;