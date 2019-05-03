import React from 'react';
import SelectRoutine from './SelectRoutine';
import Exercises from './Exercises';
import Routines from './Routines';
import gql from "graphql-tag";
import { Query } from 'react-apollo';
import { graphql, compose } from 'react-apollo';
import AddCircle from '@material-ui/icons/AddCircle';
import AddExerciseTemplate from './AddExerciseTemplate';
import Toggle from '../Components/Toggle';
import CalendarView from './CalendarView';
import moment from 'moment';

import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet
import { getDuration } from '../../startup/client/utils';

const createSet = gql`
    mutation createSet($weight: Float!, $reps: Int!, $exerciseId: String!) {
        createSet(weight: $weight, reps: $reps, exerciseId: $exerciseId){
            _id
            weight
            reps
            setNumber
        }
    }
`;

const editSet = gql`
    mutation editSet($_id: String!, $weight: Float!, $reps: Int!){
        editSet(_id: $_id, weight: $weight, reps: $reps){
            _id
        }
    }
`;

const deleteSet = gql`
    mutation deleteSet($_id: String!){
        deleteSet(setId: $_id){
            _id
            sets {
                _id
                setNumber
                weight
                reps
                orm
            }
            
        }
    }
`;
const endRoutine = gql`
    mutation endRoutine($_id: String!){
        endRoutine(_id: $_id){
            _id
        }
    }
`;

const createRoutine = gql`
    mutation createRoutine($templateId: String!, $exerciseTemplateIds: [String!]){
        createRoutine(templateId: $templateId, exerciseTemplateIds: $exerciseTemplateIds){
            _id
        }
    }
`;

const startExercise = gql`
    mutation startExercise($_id: String!, $sets: [SetInput]){
        startExercise(_id: $_id, sets: $sets){
            _id
            sets {
                _id
                setNumber
                orm
                weight
                reps
            }
        }
    }
`;

const endExercise = gql`
    mutation endExercise($_id: String!){
        endExercise(_id: $_id){
            _id
        }
    }
`;

const addExercise = gql`
    mutation addExercise($_id: String!, $exerciseTemplateId: String!){
        addExercise(_id: $_id, exerciseTemplateId: $exerciseTemplateId){
            _id
        }
    }
`

const updateSets = gql`
    mutation updateSets($sets: [SetInput]!, $exerciseId: String!){
        updateSets(sets: $sets, exerciseId: $exerciseId){
            _id
            weight
            reps
        }
    }
`

const routineQuery = gql`
  query routine($_id: String!) {
    routine(_id: $_id) {
      _id
      name
      exercises {
        _id
        startTime
        endTime
        name
        sets {
            _id
          weight
          reps
          orm
          setNumber
        }
        exerciseStats{
            totalWeight
            totalReps
            topORM
        }
        exerciseTemplate{
            topExerciseStats{
                totalWeight
                totalReps
                topORM
            }
        }
        previousExercise {
            exerciseStats {
                totalWeight
                totalReps
                topORM
            }
            sets {
                setNumber,
                weight,
                reps,
                orm
            }
        }
      }
    }
  }
`;

const DEFAULT_SETS = {
    sets: [
        {setNumber: 1, weight: 0, reps: 0, orm: 0},
        {setNumber: 2, weight: 0, reps: 0, orm: 0},
        {setNumber: 3, weight: 0, reps: 0, orm: 0},
        {setNumber: 4, weight: 0, reps: 0, orm: 0},
    ]
}

class Workout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            routine: null,
            selectRoutineModal: false,
            activeExercises: {},
            finishedExercises: [],
            addExerciseModal: false,
            selectedView: "Calendar View",
            routineDates: [],
            routinesForDay: [],
            viewWorkout: false,
            addedSetId: null,
        }
        this.debounceIds = {};
    }

    componentDidMount = () => {
        this.loadWorkout();
    }

    loadWorkout = () => {
        const {getMostRecentRoutine, loading} = this.props;
        if(!loading && getMostRecentRoutine && getMostRecentRoutine.startTime && getMostRecentRoutine.endTime === null && this.state.routine === null){
            const finishedExercises = getMostRecentRoutine.exercises.filter(exercise => exercise.endTime !== null).map(exercise => exercise._id)
            let activeExercises = {};
            getMostRecentRoutine.exercises.forEach(exercise => {
                if (exercise.startTime !== null && exercise.endTime === null){
                    activeExercises = {
                        ...activeExercises,
                        [exercise._id] : {
                            _id: exercise._id,
                            sets: exercise.sets
                        }
                    }
                    // const tempSets = [...exercise.sets];
                    // const lastSet = tempSets.pop();
                    // if (exercise.previousExercise && exercise.previousExercise.sets.length > exercise.sets.length){
                    //     activeExercise = {
                    //         _id: exercise._id,
                    //         ...exercise.previousExercise.sets[exercise.sets.length]
                    //     }
                    // }else if (lastSet == undefined){
                    //     activeExercise = {
                    //         _id: exercise._id,
                    //         weight: 0,
                    //         reps: 0,
                    //         setNumber: 1
                    //     }
                    // } else {
                    //     activeExercise = {
                    //         _id: exercise._id,
                    //         weight: lastSet.weight,
                    //         reps: lastSet.reps,
                    //         setNumber: exercise.sets.length + 1
                    //     }
                    // }
                }
            })
            this.setState({
                routine: getMostRecentRoutine,
                activeExercises,
                finishedExercises
            })
        } 
    }

    closeSelectRoutineModal = (e) => {
        e.preventDefault();
        this.setState({selectRoutineModal: false})
    }

    openSelectRoutineModal = (e) => {
        e.preventDefault();
        this.setState({selectRoutineModal: true})
    }

    selectRoutine = (routineTemplate) => (e) => {
        e.preventDefault();
        this.setState({routineTemplate});
        const exerciseTemplateIds = routineTemplate.exerciseTemplates
            ? routineTemplate.exerciseTemplates.map(exerciseTemplate => exerciseTemplate._id)
            : [];
        this.props.createRoutine({
            variables: {
                templateId: routineTemplate._id,
                exerciseTemplateIds
            }
        }).then(({data}) => {
            this.setState({
                routine: {
                    _id: data.createRoutine._id,
                    name: routineTemplate.name,
                },
                selectRoutineModal: false
            })
        }).catch((error) => {
            console.log('select routine', error)
        })
    }
    
    startExercise = (_id, previousExercise) => (e) => {
        e.preventDefault();
        const prevloadValue = previousExercise.sets && previousExercise.sets.length !== 0 
            ? previousExercise
            : DEFAULT_SETS
        const sets = prevloadValue.sets.map(set => ({
            setNumber: set.setNumber,
            reps: set.reps,
            weight: set.weight,
            orm: set.orm
        }))
        console.log('preloadValue Exercise', prevloadValue)
        console.log('sets', sets);
        this.props.startExercise({
            variables: {
                _id,
                sets
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                activeExercises: {
                    ...prevState.activeExercises,
                    [_id]: {
                        _id,
                        sets: data.startExercise.sets
                    }
                }
            }))
        }).catch((error) => {
            console.log('startExercise', error)
        })
    }

    debounceUpdates = (exerciseId) => {
        console.log('debounceId', this.debounceIds[exerciseId]);
        if (this.debounceIds[exerciseId]){
            //this.setState({editSetId: this.setId})
            console.log('clearTimeout')
            clearTimeout(this.debounceIds[exerciseId])
            this.debounceIds[exerciseId] = null;
        } 
            // if (this.state.editSetId !== null && this.state.editSetId !== setId){
            //     this.setState({editSetId: null})
            // }
            // this.setId = setId;
            this.debounceIds[exerciseId] = setTimeout(() => {
                console.log('saveUpdatedSets');
                this.saveUpdatedSets(exerciseId);
                this.debounceIds[exerciseId] = null;
            },5000)
            console.log('setTimeout', this.debounceIds[exerciseId]);
        
    }

    // onChange = (field) => (e) => {
    //     e.preventDefault();
    //     e.persist();
    //     this.setState((prevState) => ({
    //         activeExercise: {
    //             ...prevState.activeExercise,
    //             [field]: e.target.value
    //         }
    //     }))
    // }

    deleteSet = (exerciseId, setId) => {
        if (this.debounceIds[exerciseId]) {
            clearTimeout(this.debounceIds[exerciseId]);
            this.debounceIds[exerciseId] = null;
            this.saveUpdatedSets(exerciseId, this.deleteExerciseSet, setId)
        } else {
            this.deleteExerciseSet(exerciseId, setId);
        }
    }

    deleteExerciseSet = (exerciseId, setId) => {
        this.props.deleteSet({
            variables: {
                _id: setId
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                activeExercises: {
                    ...prevState.activeExercises,
                    [exerciseId]: {
                        _id: exerciseId,
                        ...data.deleteSet
                    }
                }
            }))
            // refetch();
        }).catch((error) => {
            console.log('deleteSet', error)
        })
    }

    saveUpdatedSets = (exerciseId, callBack = undefined, callBackParams = undefined) => {
        console.log('savUpdatesSet', callBack, callBackParams)
        const setInputs = this.state.activeExercises[exerciseId].sets.map(set => {
            const {__typename, ...setInput} = set
            return setInput;
        })
        this.props.updateSets({
            variables: {
                sets: setInputs,
                exerciseId
            }
        }).then(({data}) => {
            console.log('saveUpdatedSets', data)
            if (callBack) callBack(exerciseId, callBackParams);
        }).catch((error) => {
            console.log('saveUpdatedSets Error', error);
        })
    }
    // startEdittingSet = (set) => {
    //     this.setState((prevState) => ({
    //         activeExercise: {
    //             _id: prevState.activeExercise._id,
    //             weight: set.weight,
    //             reps: set.reps,
    //             setNumber: prevState.activeExercise.setNumber
    //         },
    //         edittingSet: true
    //     }))
    // }

    updateSetByInput = (_id, field) => (e) => {
        e.preventDefault();
        e.persist();
        this.updateSetByIncrement(_id, field, e.target.value)(e);
    }
    updateSetByIncrement = (exerciseId, _id, field, value) => (e) => {
        console.log('updateSEtByInc', _id, field, value);
        this.setState((prevState) => ({
            activeExercises : {
                ...prevState.activeExercises,
                [exerciseId]: {
                    ...prevState.activeExercises[exerciseId],
                    sets: prevState.activeExercises[exerciseId].sets.map(set => {
                        if (_id === set._id){
                            return {...set, [field]: value > 0 ? value : 0}
                        }
                        return set;
                    })
                }
            }
        }))
        this.debounceUpdates(exerciseId)
    }
    // editSet = (setId, refetch) => {
    //     const {weight, reps} = this.state.activeExercise;
    //     this.props.editSet({
    //         variables: {
    //             _id: setId,
    //             weight: parseFloat(weight),
    //             reps: parseInt(reps)
    //         }
    //     }).then(({data}) => {
    //         this.setState((prevState) => ({
    //             activeExercise: {
    //                 _id: prevState.activeExercise._id,
    //                 weight,
    //                 reps,
    //                 setNumber: prevState.activeExercise.setNumber
    //             }
    //         }))
    //         refetch();
    //     }).catch((error) => {
    //         console.log('editSet', error);
    //     })
    // }

    addSet = (exerciseId) => (e) => {
        e.preventDefault();
        console.log('addSet')
        const activeExercise = this.state.activeExercises[exerciseId];
        const {weight, reps, setNumber} = activeExercise.sets[activeExercise.sets.length - 1];
        this.props.createSet({
            variables: {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                // setNumber,
                exerciseId
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                activeExercises: {
                    ...prevState.activeExercises,
                    [exerciseId] : {
                        ...prevState.activeExercises[exerciseId],
                        sets: [...prevState.activeExercises[exerciseId].sets, data.createSet]
                    }
                },
                addedSetId: data.createSet._id
            }))
            // if (previousExercise && previousExercise.sets.length > setNumber){
            //     this.setState((prevState) => ({
            //         activeExercise: {
            //             _id: prevState.activeExercise._id,
            //             ...previousExercise.sets[setNumber]
            //         }
            //     }))
            // } else {
            //     this.setState((prevState) => ({
            //         activeExercise: {
            //             _id: prevState.activeExercise._id,
            //             weight,
            //             reps,
            //             setNumber: prevState.activeExercise.setNumber + 1,
            //         }
            //     }))
            // }
            // refetch();
            setTimeout(()=> {this.setState({addedSetId: null})}, 2000)
        }).catch((error) => {
            console.log('createSet', error);
        })

    }

    finishWorkout = (e = undefined) => {
        if(e) e.preventDefault();
        console.log('fishishs');
        let savedExercise = false;
        const activeExerciseIds = Object.keys(this.state.activeExercises);
        for(let exerciseId of activeExerciseIds){
            if (this.debounceIds[exerciseId]){
                clearTimeout(this.debounceIds[exerciseId]);
                this.debounceIds[exerciseId] = null;
                console.log('saveFinished')
                this.saveUpdatedSets(exerciseId, this.endExercise, this.finishWorkout);
                savedExercise = true;
                break;
            }
        }
        if (!savedExercise){
            this.saveFinishedWorkout();
        }
        // if (this.debounceId) {
            // clearTimeout(this.debounceId);
            // this.saveUpdatedSets(this.saveFinishedWorkout)
        // } else {
        // }
    }

    saveFinishedWorkout = () => {
        console.log('saveFinishedWorkout')
        this.props.endRoutine({
            variables: {
                _id: this.state.routine._id
            }
        }).then(({data}) => {
            this.setState({
                routine: null,
                activeExercises: {},
                finishedExercises: []
            })
        }).catch((error) => {
            console.log('endRoutine', error);
        })
    }

    finishExercise = (exerciseId, refetch) => (e) => {
        e.preventDefault();
        if (this.debounceIds[exerciseId]){
            clearTimeout(this.debounceIds[exerciseId])
            this.debounceIds[exerciseId] = null;
            this.saveUpdatedSets(exerciseId, this.endExercise, refetch);
        } else {
            this.endExercise(exerciseId, refetch);
        }
    }

    // finishSetEndExercise = (refetch) => {
    //     const {weight, reps, setNumber} = this.state.activeExercise;
    //     this.props.createSet({
    //         variables: {
    //             weight: parseFloat(weight),
    //             reps: parseInt(reps),
    //             // setNumber,
    //             exerciseId: this.state.activeExercise._id
    //         }
    //     }).then(({data}) => {
    //         this.endExercise(refetch);
    //     }).catch((error) => {
    //         console.log('createSet', error);
    //     })
    // }

    endExercise = (exerciseId, refetch) => {
        console.log('endExercise');
        const {[exerciseId]: value, ...activeExercises} = this.state.activeExercises;
        this.props.endExercise({
            variables: {
                _id: exerciseId
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                finishedExercises: [...prevState.finishedExercises, exerciseId],
                activeExercises
            }))
            refetch()
        }).catch((error) => {
            console.log('endExercise', error)
        })
    }

    toggleAddExercise = (e) => {
        e.preventDefault();
        this.setState((prevState) => ({addExerciseModal: !prevState.addExerciseModal}))
    }

    addExercise = (refetch) => (exerciseTemplate) => (e) => {
        e.preventDefault();
        this.props.addExercise({
            variables: {
                _id: this.state.routine._id,
                exerciseTemplateId: exerciseTemplate._id
            }
        }).then(({data}) => {
            refetch();
            this.setState({addExerciseModal: false})
        }).catch((error) => {
            console.log('addExercise', error)
        })
    }

    viewWorkout = (routine) => (e) => {
        this.setState({
            routine,
            finishedExercises: routine.exercises.filter(exercise => exercise.endTime != null).map(exercise => exercise._id),
            viewWorkout: true
        })
    }

    cancelViewWorkout = () => {
        this.setState({
            routine: null,
            finishedExercises: [],
            viewWorkout: false
        })
    }

    // handleSelectedDate = (date) => {
    //     console.log('interpolate selection');
    //     this.setState({selectedDate: moment(date).format("YYYY-MM-DD")});
    // }

    // onChangeDate = date => {
    //     const formattedDate = moment(date).format("YYYY-MM-DD");
    //     console.log('formattedDate', formattedDate);
    //     this.setState({date: formattedDate})
    // }
    dateOfRoutine = (routineDate) => {
        let firstIndex = true
        for(let routine of this.state.routineDates){
            if (firstIndex){
                firstIndex = false;
                continue;
            }
            if (routine === routineDate){
                return true;
            }
        }
        
    }
    onSelectDate = (date, state = undefined) => {
        let _routineDates = state ? state : [...this.state.routineDates];
        _routineDates[0] = state ? date : moment(date, "x").format("YYYY-MM-DD");
        let routinesForDay = []
        if (state || this.dateOfRoutine(_routineDates[0])){
            routinesForDay = this.props.routines.filter(routine => 
                moment(routine.startTime, "x").format("YYYY-MM-DD") === _routineDates[0])
        } 
        this.setState({routineDates: _routineDates, routinesForDay})
        
    }
    toggleView = (selectedView) => (e) => {
        this.setState({selectedView})
    }
    render(){
        const {routine, activeExercises, finishedExercises, viewWorkout, selectRoutineModal, routinesForDay, addExerciseModal, selectedView, routineDates} = this.state;
        const {routineTemplates, exerciseTemplates, routines, loading, ...data} = this.props;
        // console.log(data);
        if (loading) return <div>Loading...</div>
        if (routineDates.length === 0) {
            if (routines && routines.length && routines.length > 0 ){
                const routineDates = routines.map(routine => moment(routine.startTime, "x").format("YYYY-MM-DD"));
                this.onSelectDate(moment().format("YYYY-MM-DD"), [routineDates[0], ...routineDates]);
            } else {
                this.onSelectDate(moment().valueOf())
            }
        }
        return (
            <React.Fragment>
                {routine === null &&
                    <React.Fragment>
                        <div className='section-title'>
                            <h1 className="workout--h1">Workouts</h1>
                            <button onClick={this.openSelectRoutineModal} className="button button--link-text">
                                <AddCircle className="icon" />
                                Add Workout
                            </button>
                        </div>
                        <div className="toggle__container">
                            <Toggle
                                name="workout-view" 
                                label="Calendar View"
                                id="workout-view__CalendarView"
                                selected={selectedView === "Calendar View"}
                                onChange={this.toggleView("Calendar View")}
                            />
                            <div className="toggle__seperator">/</div>
                            <Toggle 
                                name="workout-view"
                                label="List View"
                                id="workout-view__ListView"
                                selected={selectedView === "List View"}
                                onChange={this.toggleView("List View")}
                            />
                        </div>
                        {selectedView === "Calendar View"
                            ?
                            <CalendarView 
                                routineDates={routineDates}
                                routinesForDay={routinesForDay}
                                onSelect={this.onSelectDate}
                                openSelectRoutineModal={this.openSelectRoutineModal}
                                today={moment().format("YYYY-MM-DD")}
                                viewWorkout={this.viewWorkout}
                            />
                            :
                            <Routines viewWorkout={this.viewWorkout} routines={routines} />
                        }
                        <form noValidate className="boxed-view__form">
                            <button onClick={this.openSelectRoutineModal} className="button">Start new Workout</button>
                        </form> 
                    </React.Fragment >
                }
                {viewWorkout && routine !== null && routine._id &&
                    <React.Fragment>
                        <div className="section-title">
                            <h1 className="workout--h1">{routine.name} {getDuration(routine.startTime, routine.endTime)}</h1>
                            <button onClick={this.cancelViewWorkout} className="button button--link-text">
                                Return
                            </button>
                        </div>
                        <Exercises
                            exercises={routine.exercises.filter(exer => finishedExercises.includes(exer._id))}
                            startExercise={this.startExercise}
                            activeExercises={activeExercises}
                            addSet={this.addSet}
                            finishExercise={this.finishExercise}
                            finishedExercises={this.state.finishedExercises}
                            updateSetByIncrement={this.updateSetByIncrement}
                            updateSetByInput={this.updateSetByInput}
                            refetch={() => {}}
                            editSet={this.editSet}
                            deleteSet={this.deleteSet}
                            startEdittingSet={this.startEdittingSet}
                        />
                        <form noValidate className="boxed-view__form">
                            <button onClick={this.cancelViewWorkout} type="submit" className="button button--margin-top">Return</button>
                        </form>
                    </React.Fragment>

                }
                {!viewWorkout && routine !== null && routine._id &&
                    <Query query={routineQuery} variables={{_id: routine._id}}>
                        {({loading, error, data, refetch}) => {
                            if (loading) return <div>Loading</div>;
                            if (error) return <div>{error}</div>;
                            return (
                                <React.Fragment>
                                    <div className="section-title">
                                        <h1 className="workout--h1">{routine.name}</h1>
                                        <button onClick={this.toggleAddExercise} className="button button--link-text">
                                            <AddCircle className="icon"/>
                                            Add Exercise
                                        </button>
                                    </div>
                                    <hr/>
                                    <Exercises
                                        exercises={data.routine.exercises}
                                        startExercise={this.startExercise}
                                        activeExercises={activeExercises}
                                        addSet={this.addSet}
                                        addedSetId={this.state.addedSetId}
                                        finishExercise={this.finishExercise}
                                        finishedExercises={this.state.finishedExercises}
                                        updateSetByIncrement={this.updateSetByIncrement}
                                        updateSetByInput={this.updateSetByInput}
                                        refetch={refetch}
                                        editSet={this.editSet}
                                        deleteSet={this.deleteSet}
                                        startEdittingSet={this.startEdittingSet}
                                    />
                                    
                                        <form noValidate className="boxed-view__form">
                                            <button
                                                // disabled={Object.keys(activeExercises).length !== 0}
                                                onClick={this.finishWorkout}
                                                type="submit"
                                                className={`button button--margin-top`}
                                            >
                                                Finish Workout
                                            </button>
                                        </form>
                                    
                                    {addExerciseModal &&
                                        <AddExerciseTemplate 
                                            exerciseTemplates={exerciseTemplates}
                                            closeAddExerciseTemplateModal={this.toggleAddExercise}
                                            selectExerciseTemplate={this.addExercise(refetch)}
                                        />
                                    }
                                </React.Fragment>
                            )
                        }}
                    </Query>
                }
                
                    <SelectRoutine 
                        modalOpen={selectRoutineModal}
                        routineTemplates={routineTemplates} 
                        closeSelectRoutineModal={this.closeSelectRoutineModal}
                        selectRoutine={this.selectRoutine}
                    />
            
            </React.Fragment>
        )
    }
}

export default compose(
graphql(createSet, {
    name: "createSet"
}), graphql(createRoutine, {
    name: "createRoutine",
    options: {
        refetchQueries: ['getMostRecentRoutine']
    }
}), 
graphql(startExercise, {
    name: "startExercise"
}), graphql(endExercise, {
    name: "endExercise"
}),
graphql(editSet, {
    name: "editSet"
}), graphql(deleteSet, {
    name: "deleteSet"
}),
graphql(endRoutine, {
    name: 'endRoutine',
    options: {
        refetchQueries: ['getMostRecentRoutine' , 'Routines']
    }
}),
graphql(updateSets, {
    name: 'updateSets'
}),
graphql(addExercise, {
    name: "addExercise", 
    options: {
        refetchQueries: ['Routines']
    }
})
)(Workout);