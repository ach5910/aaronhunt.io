import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';

class CreateExercise extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            setCount: props.exercise.sets.length,
            editSetId: null,
            setActive: false
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

    finishSet = (refetch, previousExercise) => (e) => {
        if (this.state.edittingSet){
            this.props.editSet(this.state.editSetId, refetch);
            this.setState({edittingSet: false, editSetId: null, setActive: false})
        } else {
            this.setState({setCount: this.list.childElementCount, setActive: false})
            this.props.addSet(refetch, previousExercise)(e)
        }
    }

    editSet = (e) => {
        e.preventDefault();
        let set = null;
        for (set of this.props.exercise.sets){
            if (set._id === this.state.editSetId){
                this.props.startEdittingSet(set);
                this.setState({edittingSet: true, setActive: true})
                break;
            }
        }
    }

    addSet = () => {
        this.setState({setActive: true})
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

    getDifferences = (curr, best, prev, fixed) => (
        <React.Fragment>
        <span style={{color: curr >= best ? "green" : "red"}}>{`${curr > best ? "+" : ""}${(curr - best).toFixed(fixed)}`}</span> / <span style={{color: curr >= prev ? "green" : "red"}}>{`${curr > prev ? "+" : ""}${(curr - prev).toFixed(fixed)}`}</span>
        </React.Fragment>
    )

    render(){
        const {exercise, refetch, activeExercise, onChange, finishExercise} = this.props;
        const {setActive} = this.state;
        const {topExerciseStats} = exercise.exerciseTemplate;
        const {previousExercise} = exercise;
        let exerciseStats = {totalWeight: 0, totalReps: 0, topORM: 0};
        if (previousExercise !== null) {
            exerciseStats = previousExercise.exerciseStats;
        }
        const {totalWeight, totalReps, topORM} = exercise.exerciseStats;
        return (
            <div className='boxed-view__box boxed-view__box--vert'>
                <div className='section-title section-title__margin-bottom'>
                    <h2 style={{marginBottom: "0px"}}>{exercise.name}</h2>
                    <button onClick={finishExercise(refetch)} className="button button--margin">Finish Exercise</button>
                </div>
                {/* <h3 style={{marginBottom: "0px", textAlign: "center"}}>vs</h3>
                <h3 style={{marginBottom: "0px", textAlign: "center"}}>Current</h3> */}
                {/* <div className="exercise--set exercise--set__header">
                    <div className='exercise--weight'><h3 >Total Weight</h3></div>
                    <div className="exercise--reps"><h3>Total Reps</h3></div>
                    <div className="exercise--orm"><h3>Max 1RM</h3></div>
                </div> */}
                
                
                {/* <h3 style={{marginBottom: "0px", textAlign: "center"}}>vs</h3>
                <h3 style={{marginBottom: "0px", textAlign: "center"}}>Current</h3> */}
                {/* <div className="exercise--set exercise--set__header">
                    <div className='exercise--weight'><h3 >Total Weight</h3></div>
                    <div className="exercise--reps"><h3>Total Reps</h3></div>
                    <div className="exercise--orm"><h3>Max 1RM</h3></div>
                </div> */}
                {/* <div className="exercise--set exercise--set__header" >
                    <h4 className="exercise--title" style={{marginBottom: "0px"}}>Current </h4>
                    <div className='exercise--weight'>Sum = {totalWeight.toFixed(2)}</div>
                    <div className="exercise--reps">Sum = {totalReps}</div>
                    <div className="exercise--orm">Max = {topORM.toFixed(2)}</div>
                </div> */}
                
                
                
                {/* <h3>Total Weight ({topExerciseStats.totalWeight.toFixed(2)}/{exerciseStats.totalWeight.toFixed(2)}) Total Reps ({topExerciseStats.totalReps}/{exerciseStats.totalReps}) Max 1RM ({topExerciseStats.topORM.toFixed(2)}/{exerciseStats.topORM.toFixed(2)})</h3>
                <h3 style={{marginBottom: "0px"}}>Last Exercise</h3>
            <h3 style={{marginLeft: "2rem"}}>Total Weight ({exerciseStats.totalWeight.toFixed(2)}) Total Reps ({exerciseStats.totalReps}) Max 1RM ({exerciseStats.topORM.toFixed(2)})</h3> */}
                <SetTitles />
                <SetList deleteSet={this.deleteSet} editSet={this.editSet} getRef={this.getRef} exercise={exercise} handleClick={this.onClickSet} editSetId={this.state.editSetId}/>
                <div noValidate className="exercise--set exercise--set__header exercise--set__large-rows">
                        <div className={`pseudo-input exercise--title ${setActive? "" : "disabled"}`} value>{activeExercise.setNumber}</div>
                        <input disabled={!setActive} className="exercise--weight" onFocus={(e) => {e.target.select()}} type="number" pattern="[0-9]*" onChange={onChange("weight")} value={activeExercise.weight} />
                        <input disabled={!setActive} className="exercise--reps" onFocus={(e) => {e.target.select()}} type="number" pattern="[0-9]*" onChange={onChange("reps")} value={activeExercise.reps} />
                        {!setActive
                            ? <button onClick={this.addSet} className="button button--secondary exercise--orm">Add Set</button>
                            : <button onClick={this.finishSet(refetch, exercise.previousExercise)} className="button button--secondary exercise--orm">Finish Set</button>
                        }
                        {/* <div className="pseudo-input exercise--orm" value>{this.getORM(activeExercise)}</div> */}
                </div>
                {/* <div className="exercise--set ">
                    <div className='exercise--weight'><h3 >Total</h3></div>
                    <div className="exercise--reps"><h3>Total</h3></div>
                    <div className="exercise--orm"><h3>Max</h3></div>
                </div> */}
                <div className="exercise--set exercise--set__header">
                    <div className='exercise--weight'><h3 >Total Weight</h3></div>
                    <div className="exercise--reps"><h3>Total Reps</h3></div>
                    <div className="exercise--orm"><h3>Max 1RM</h3></div>
                </div>
                <div className="exercise--set exercise--set__header " >
                    <h3 className="exercise--title">Total</h3>
                    <h4 className='exercise--weight'>{totalWeight.toFixed(2)}</h4>
                    <h4 className="exercise--reps">{totalReps}</h4>
                    <h4 className="exercise--orm">{topORM.toFixed(2)}</h4>
                </div>
                <div className="exercise--set exercise--set__header">
                    <h3 className="exercise--title" style={{marginBottom: "0px"}}>Best / Last</h3>
                    <h4 className='exercise--weight'>{topExerciseStats.totalWeight.toFixed(2)} / {exerciseStats.totalWeight.toFixed(2)}</h4>
                    <h4 className="exercise--reps">{topExerciseStats.totalReps} / {exerciseStats.totalReps}</h4>
                    <h4 className="exercise--orm">{topExerciseStats.topORM.toFixed(2)} / {exerciseStats.topORM.toFixed(2)}</h4>
                </div>
                <div className="exercise--set exercise--set__header" >
                    <h3 className="exercise--title" style={{marginBottom: "0px"}}>Difference</h3>
                    <div className='exercise--weight'>{this.getDifferences(totalWeight, topExerciseStats.totalWeight, exerciseStats.totalWeight, 2)}</div>
                    <div className="exercise--reps">{this.getDifferences(totalReps, topExerciseStats.totalReps, exerciseStats.totalReps, 0)}</div>
                    <div className="exercise--orm">{this.getDifferences(topORM, topExerciseStats.topORM.toFixed(2), exerciseStats.topORM.toFixed(2), 2)}</div>
                </div>
                <div className="button__container">
                    {/* <button onClick={this.addSet(refetch, exercise.previousExercise)} className="button button--secondary button--margin">Add Set</button> */}
                    
                </div>
            </div>
        )
    }
}

export default CreateExercise;