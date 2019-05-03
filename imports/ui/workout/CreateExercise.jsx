import React from 'react';
import SetTitles from './SetTitles';
import SetList from './SetList';
import EditSetList from './EditSetList';
import RadioGroup from '../Components/RadioGroup';
import AddCircle from '@material-ui/icons/AddCircle'
import AddIcon from '../Components/AddIcon';

class CreateExercise extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            // setCount: props.exercise.sets.length,
            // editSetId: null,
            // setActive: false,
            selectedSetId: "",
            increments: {
                weight: 2.5,
                reps: 1
            },
            expand: false
        }
        this.setId = null;
        this.weightInput = React.createRef();
        this.selectItemTimeout = null;
        this.doublClickTimeOut = null;
    }

    getORM = (activeExercise) => {
        const orm = parseInt(activeExercise.weight) * (1 + (parseInt(activeExercise.reps) / 30))
        return isNaN(orm) ? 0 : orm.toFixed(2);
    }

    handleSelection = (setId) => {
        console.log('handleClick')
        if (this.state.selectedSetId !== setId) {
            this.debounceSetItem(false);
            this.setState({selectedSetId: setId, expand: false})
        }
    }

    deleteSet = (setId) => {
        const {activeExercise} = this.props;
        this.props.deleteSet(activeExercise._id, setId);
    }

    debounceSetItem = (expand) => {
        if (this.selectItemTimeout){
            clearTimeout(this.selectItemTimeout)
        }
        if (!expand){
            this.selectItemTimeout = setTimeout(() => {
                if (!this.state.expand){
                    this.setState({selectedSetId: ""});
                } else {
                    clearTimeout(this.selectItemTimeout)
                }
            }, 3000)
        }
    }
        
      

    updateSetByIncrement = (_id, field, value) => (e) => {
        const {activeExercise} = this.props;
        console.log('updateSetByInc CREATE NEW');
        e.stopPropagation();
        this.props.updateSetByIncrement(activeExercise._id, _id, field, value)(e);
        this.debounceSetItem(this.state.expand);
    }

    changeIncrement = (counter) => (newIncrement) => {
        this.setState((prevState) => ({
            increments: {
                ...prevState.increments,
                [counter]: newIncrement
            }
        }))
    }

    handleExpand = (e) => {
        this.debounceSetItem(!this.state.expand);
        this.setState((prev) => ({expand: !prev.expand}))
    }
    // getRef = (el) => {
    //     this.list = el;
    // }

    // onClickSet = (setId) => {
    //     if (this.setId === setId){
    //         this.setState({editSetId: this.setId})
    //         clearTimeout(this.doublClickTimeOut)
    //     } else {
    //         if (this.state.editSetId !== null && this.state.editSetId !== setId){
    //             this.setState({editSetId: null})
    //         }
    //         this.setId = setId;
    //         this.doublClickTimeOut = setTimeout(() => {
    //             this.setId = null;
    //         },1000)
    //     }

    // }

    // getDifferences = (curr, best, prev, fixed) => (
    //     <React.Fragment>
    //         <span style={{color: curr >= best ? "green" : "red"}}>{`${curr > best ? "+" : ""}${(curr - best).toFixed(fixed)}`}</span> / <span style={{color: curr >= prev ? "green" : "red"}}>{`${curr > prev ? "+" : ""}${(curr - prev).toFixed(fixed)}`}</span>
    //     </React.Fragment>
    // )

    render(){
        const {exercise, refetch, activeExercise, addedSetId, onChange, finishExercise} = this.props;
        // const {setActive} = this.state;
        const {topExerciseStats} = exercise.exerciseTemplate;
        const {previousExercise} = exercise;
        let exerciseStats = {totalWeight: 0, totalReps: 0, topORM: 0};
        if (previousExercise !== null) {
            exerciseStats = previousExercise.exerciseStats;
        }
        const {totalWeight, totalReps, topORM} = exercise.exerciseStats;
        console.log(activeExercise);
        return (
            <div className='boxed-view__box boxed-view__box--vert'>
                <div className='section-title section-title__margin-bottom'>
                    <h2 className="workout--h2" style={{marginBottom: "0px"}}>{exercise.name}</h2>
                    <button onClick={finishExercise(activeExercise._id, refetch)} className="button button--margin">Finish Exercise</button>
                </div>
                <SetTitles className="titles" />
                <EditSetList 
                    exercise={activeExercise}
                    increments={this.state.increments}
                    addedSetId={addedSetId}
                    handleExpand={this.handleExpand}
                    expand={this.state.expand}
                    updateSetByIncrement={this.updateSetByIncrement}
                    selectedSetId={this.state.selectedSetId}
                    deleteSet={this.deleteSet}
                    handleClick={this.handleSelection}
                    weightIncrementOptions={
                        <RadioGroup  
                            values={[2.5, 10, 50]}
                            style={{borderRight: "none"}}
                            selected={this.state.increments.weight}
                            handleClick={this.changeIncrement("weight")}
                            groupName="weight"
                            groupId={`${activeExercise._id}-weight`}
                        />}
                    repIncrementOptions={
                        <RadioGroup  
                            values={[1, 10, 20]}
                            selected={this.state.increments.reps}
                            handleClick={this.changeIncrement('reps')}
                            groupName="reps"
                            groupId={`${activeExercise._id}-reps`}
                        />}
                />
                <div className="button__container button__container--start">
                    <div className="button__icon-container ">
                        <AddIcon clickHandler={this.props.addSet(activeExercise._id)} />
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateExercise;