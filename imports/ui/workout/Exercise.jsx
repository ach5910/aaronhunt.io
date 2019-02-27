import React from 'react';

const getORM = (activeExercise) => {
    const orm = parseInt(activeExercise.weight) * (1 + (parseInt(activeExercise.reps) / 30))
    return isNaN(orm) ? 0 : orm.toFixed(2);
}

class Exercise extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            setCount: props.exercise.sets.length
        }
    }

    componentDidUpdate = () => {
        if (this.list && this.state.setCount + 1 === this.list.childElementCount){
            this.list.lastElementChild.scrollIntoView({behavior: 'smooth'});
        }
    }

    addSet = (refetch) => (e) => {
        this.setState({setCount: this.list.childElementCount})
        this.props.addSet(refetch)(e)
    }
    render(){
        const {exercise, refetch, activeExercise, finishedExercises, onChange, startExercise, finishExercise} = this.props
        return (
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
                        <ul ref={(el) => {this.list = el}} >
                            {exercise.sets.map(set => (
                                <li className="exercise--set">
                                    <div className='exercise--weight'>{set.weight}</div>
                                    <div className="exercise--reps">{set.reps}</div>
                                    <div className="exercise--orm">{set.orm.toFixed(2)}</div>
                                </li>
                            ))}
                        </ul>
                        <form noValidate className="exercise--set">
                                <input className="exercise--weight" onFocus={(e) => {e.target.select()}} type="number" pattern="[0-9]*" onChange={onChange("weight")} value={activeExercise.weight} />
                                <input className="exercise--reps" onFocus={(e) => {e.target.select()}} type="number" pattern="[0-9]*" onChange={onChange("reps")} value={activeExercise.reps} />
                                <div className="pseudo-input exercise--orm" value>{getORM(activeExercise)}</div>
                        </form>
                        <div className="button__container">
                            <button onClick={this.addSet(refetch)} className="button button--secondary button--margin">Add Set</button>
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
    }
}

export default Exercise;