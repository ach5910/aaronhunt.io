import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';

class CreateExercise extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            setCount: props.exercise.sets.length,
            editSetId: null
        }
        this.setId = null;
        this.doublClickTimeOut = null;
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
        if (this.state.edittingSet){
            this.props.editSet(this.state.editSetId, refetch);
            this.setState({edittingSet: false, editSetId: null})
        } else {
            this.setState({setCount: this.list.childElementCount})
            this.props.addSet(refetch)(e)
        }
    }

    editSet = (e) => {
        e.preventDefault();
        let set = null;
        for (set of this.props.exercise.sets){
            if (set._id === this.state.editSetId){
                this.props.startEdittingSet(set);
                this.setState({edittingSet: true})
                break;
            }
        }
    }

    deleteSet = (e) => {
        e.preventDefault();
        this.props.deleteSet(this.state.editSetId, this.props.refetch)
        this.setState({edittingSet: false, editSetId: null})
    }

    getRef = (el) => {
        this.list = el;
    }

    onClickSet = (setId) => {
        console.log('setId', setId)
        console.log('this.setId', this.setId)
        if (this.setId === setId){
            this.setState({editSetId: this.setId})
            clearTimeout(this.doublClickTimeOut)
        } else {
            if (this.state.editSetId !== null && this.state.editSetId !== setId){
                this.setState({editSetId: null})
            }
            this.setId = setId;
            this.doublClickTimeOut = setTimeout(() => {
                this.setId = null;
            },1000)
        }

    }

    render(){
        const {exercise, refetch, activeExercise, onChange, finishExercise} = this.props;
        return (
            <div className='boxed-view__box boxed-view__box--vert'>
                <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
                <SetTitles />
                <SetList deleteSet={this.deleteSet} editSet={this.editSet} getRef={this.getRef} exercise={exercise} handleClick={this.onClickSet} editSetId={this.state.editSetId}/>
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