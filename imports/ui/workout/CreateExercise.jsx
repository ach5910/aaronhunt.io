import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';

class CreateExercise extends React.Component{
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

    getORM = (activeExercise) => {
        const orm = parseInt(activeExercise.weight) * (1 + (parseInt(activeExercise.reps) / 30))
        return isNaN(orm) ? 0 : orm.toFixed(2);
    }

    addSet = (refetch) => (e) => {
        this.setState({setCount: this.list.childElementCount})
        this.props.addSet(refetch)(e)
    }

    getRef = (el) => {
        this.list = el;
    }

    render(){
        const {exercise, refetch, activeExercise, onChange, finishExercise} = this.props
        return (
            <div className='boxed-view__box boxed-view__box--vert'>
                <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
                <SetTitles />
                <SetList getRef={this.getRef} exercise={exercise}/>
                <form noValidate className="exercise--set">
                        <input className="exercise--weight" onFocus={(e) => {e.target.select()}} type="number" pattern="[0-9]*" onChange={onChange("weight")} value={activeExercise.weight} />
                        <input className="exercise--reps" onFocus={(e) => {e.target.select()}} type="number" pattern="[0-9]*" onChange={onChange("reps")} value={activeExercise.reps} />
                        <div className="pseudo-input exercise--orm" value>{this.getORM(activeExercise)}</div>
                </form>
                <div className="button__container">
                    <button onClick={this.addSet(refetch)} className="button button--secondary button--margin">Add Set</button>
                    <button onClick={finishExercise(refetch)} className="button button--margin">Finish Exercise</button>
                </div>
            </div>
        )
    }
}

export default CreateExercise;