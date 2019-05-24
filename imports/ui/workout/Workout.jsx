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
import AddIcon from '../Components/AddIcon';
import moment from 'moment';

import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet
import { getDuration } from '../../startup/client/utils';
import ViewWorkout from './ViewWorkout';
import TabBar from '../Components/TabBar';
import WorkoutDate from './WorkoutDate';

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

// const editSet = gql`
//     mutation editSet($_id: String!, $weight: Float!, $reps: Int!){
//         editSet(_id: $_id, weight: $weight, reps: $reps){
//             _id
//         }
//     }
// `;

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
    mutation endRoutine($_id: String!, $logged: Boolean, $date: String, $duration: String ){
        endRoutine(_id: $_id, logged: $logged, date: $date, duration: $duration){
            _id
        }
    }
`;

const createRoutine = gql`
    mutation createRoutine($templateId: String!, $exerciseTemplateIds: [String!], $logged: Boolean!){
        createRoutine(templateId: $templateId, exerciseTemplateIds: $exerciseTemplateIds, logged: $logged){
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

const cancelExercise = gql`
    mutation cancelExercise($_id: String!, $setIds: [String]){
        cancelExercise(_id: $_id, setIds: $setIds){
            _id
        }
    }
`

const deleteExercise = gql`
    mutation deleteExercise($_id: String!, $routineId: String!){
        deleteExercise(_id: $_id, routineId: $routineId)
    }
`

const routineQuery = gql`
  query routine($_id: String!) {
    routine(_id: $_id) {
      _id
      name
      logged
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
            logDate: undefined,
            logDuration: "1:30"
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
                }
            })
            this.setState({
                routine: getMostRecentRoutine,
                activeExercises,
                finishedExercises
            })
        } 
    }

    componentDidUpdate = (prevProps, prevState) => {
        const {routines} = this.props;
        const {routineDates} = this.state;
        // We a new routine is created. Update the routineDates and choose the selected date (logDate).
        // Check that routineDates hasn't already been update via initial load
        if (prevProps.routines && routines && prevProps.routines.length !== routines.length 
            && routineDates.length > 0 && prevState.routineDates.length === routineDates.length){
            
            const {logDate} = this.state;
            const _routineDates = routines.map(routine => moment(routine.startTime, "x").format("YYYY-MM-DD"));
            this.onSelectDate(moment(logDate, "MM/DD/YY").format("YYYY-MM-DD"), [_routineDates[0], ..._routineDates]);
            
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

    selectRoutine = (routineTemplate, recordMethod) => (e) => {
        e.preventDefault();
        this.setState({routineTemplate});
        const exerciseTemplateIds = routineTemplate.exerciseTemplates
            ? routineTemplate.exerciseTemplates.map(exerciseTemplate => exerciseTemplate._id)
            : [];
        this.props.createRoutine({
            variables: {
                templateId: routineTemplate._id,
                exerciseTemplateIds,
                logged: recordMethod === 'log'
            }
        }).then(({data}) => {
            this.setState({
                routine: {
                    _id: data.createRoutine._id,
                    name: routineTemplate.name,
                    logged: recordMethod === 'log'
                },
                selectRoutineModal: false
            })
        }).catch((error) => {
            console.log('select routine', error)
        })
    }
    
    startExercise = (_id, previousExercise) => (e) => {
        e.preventDefault();
        const prevloadValue = previousExercise && previousExercise.sets && previousExercise.sets.length !== 0 
            ? previousExercise
            : DEFAULT_SETS
        const sets = prevloadValue.sets.map(set => ({
            setNumber: set.setNumber,
            reps: set.reps,
            weight: set.weight,
            orm: set.orm
        }))
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

    deleteExercise = (exerciseId, routineId) => (e) => {
        const {exerciseId: value, ...activeExercises} = this.state.activeExercises;
        if (this.debounceIds[exerciseId]){
            clearTimeout(this.debounceIds[exerciseId]);
            this.debounceIds[exerciseId] = null;
        }
        this.props.deleteExercise({
            variables: {
                _id: exerciseId,
                routineId
            }
        }).then(({data}) => {
            console.log('deleteExercise', data);
            this.setState((prevState) => ({
                activeExercises,
                finishedExercises: prevState.finishedExercises
                    .filter((_id) => _id !== exerciseId)
            }))
        }).catch((error) => {
            console.log('deleteExericse', error)
        })
    }

    debounceUpdates = (exerciseId) => {
        if (this.debounceIds[exerciseId]){
            clearTimeout(this.debounceIds[exerciseId])
            this.debounceIds[exerciseId] = null;
        } 
            this.debounceIds[exerciseId] = setTimeout(() => {
                this.saveUpdatedSets(exerciseId);
                this.debounceIds[exerciseId] = null;
            },5000)
    }

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
        }).catch((error) => {
            console.log('deleteSet', error)
        })
    }

    saveUpdatedSets = (exerciseId, callBack = undefined, callBackParams = undefined) => {
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
            if (callBack) callBack(exerciseId, callBackParams);
        }).catch((error) => {
            console.log('saveUpdatedSets Error', error);
        })
    }

    updateSetByIncrement = (exerciseId, _id, field, value) => (e) => {
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

    addSet = (exerciseId) => (e) => {
        e.preventDefault();
        const activeExercise = this.state.activeExercises[exerciseId];
        const {weight, reps, setNumber} = activeExercise.sets[activeExercise.sets.length - 1];
        this.props.createSet({
            variables: {
                weight: parseFloat(weight),
                reps: parseInt(reps),
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
            setTimeout(()=> {this.setState({addedSetId: null})}, 2000)
        }).catch((error) => {
            console.log('createSet', error);
        })

    }

    finishWorkout = (e = undefined) => {
        if(e) e.preventDefault();
        // let savedExercise = false;
        const exerciseId = Object.keys(this.state.activeExercises)[0];
        if (exerciseId) {
            this.finishExercise(exerciseId, this.finishWorkout)();
        } else {
            this.saveFinishedWorkout();
        }
        // for(let exerciseId of activeExerciseIds){
        //     if (this.debounceIds[exerciseId]){
        //         clearTimeout(this.debounceIds[exerciseId]);
        //         this.debounceIds[exerciseId] = null;
        //         this.saveUpdatedSets(exerciseId, this.endExercise, this.finishWorkout);
        //         savedExercise = true;
        //         break;
        //     }
        // }
    }

    saveFinishedWorkout = () => {
        let variables = {
            _id: this.state.routine._id,
        }
        const {logged} = this.state.routine;
        const {logDate, logDuration} = this.state;
        if (logged && logDate && logDuration) {
            variables = {
                ...variables,
                logged,
                date: logDate,
                duration: logDuration
            }
        }
        this.props.endRoutine({
            variables
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
        if (e) e.preventDefault();
        if (this.debounceIds[exerciseId]){
            clearTimeout(this.debounceIds[exerciseId])
            this.debounceIds[exerciseId] = null;
            this.saveUpdatedSets(exerciseId, this.endExercise, refetch);
        } else {
            this.endExercise(exerciseId, refetch);
        }
    }

    cancelExercise = (exerciseId, refetch, viewWorkout = false) => (e) => {
        console.log('cancelExercise viewWorkout', viewWorkout);
        const {[exerciseId]: exercise, ...activeExercises} = this.state.activeExercises;
        this.props.cancelExercise({
            variables: {
                _id: exerciseId,
                setIds: exercise.sets.map((set) => set._id)
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                activeExercises,
                finishedExercises: viewWorkout
                    ? prevState.finishedExercises.filter(_id => _id !== exerciseId)
                    : prevState.finishedExercises
            }))
            if (refetch) refetch();
        }).catch((error) => {
            console.log('cancelExercise error', error)
        })
    }

    endExercise = (exerciseId, refetch) => {
        const {[exerciseId]: exercise, ...activeExercises} = this.state.activeExercises;
        this.props.endExercise({
            variables: {
                _id: exerciseId
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                finishedExercises: [...prevState.finishedExercises, exerciseId],
                activeExercises,
                // routine: {
                //     ...prevState.routine,
                //     exercises: prevState.routine.exercises.map((ex) => {
                //         if (ex._id === exerciseId){
                //             return exercise;
                //         } 
                //         return ex;
                //     })
                // }
            }))
            if (refetch) refetch();
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

    editExercise = (exercise, viewWorkout = false) => (e) => {
        e.preventDefault();
        this.setState((prevState) => ({
            activeExercises: {
                ...prevState.activeExercises,
                [exercise._id]: {
                    ...exercise
                }
            },
            finishedExercises: viewWorkout
                ? prevState.finishedExercises
                : prevState.finishedExercises.filter((_id) => (_id !== exercise._id))
        }))
    }

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

    onSelectLogDate = (date) => {
        this.setState({logDate: moment(date).format("MM/DD/YY")})
    }

    onSelectLogDuration = (logDuration) => (e) => {
        this.setState({logDuration})
    }

    onSelectDate = (date, state = undefined) => {
        let _routineDates = state ? state : [...this.state.routineDates];
        _routineDates[0] = state ? date : moment(date, "x").format("YYYY-MM-DD");
        let routinesForDay = []
        if (state || this.dateOfRoutine(_routineDates[0])){
            routinesForDay = this.props.routines.filter(routine => 
                moment(routine.startTime, "x").format("YYYY-MM-DD") === _routineDates[0])
        } 
        this.setState({
            routineDates: _routineDates,
            routinesForDay,
            logDate: moment(_routineDates[0]).format("MM/DD/YY")
        })
        
    }
    toggleView = (selectedView) => (e) => {
        this.setState({selectedView})
    }

    logTime = (e) => {

        if(e) e.preventDefault();
        const {logDate, logDuration} = this.state;
        // console.log('date', routineDates[0])
        // console.log('date moment', moment(routineDates[0]))
        console.log('date moment format', moment(logDate, "MM/DD/YY").format("MM/DD/YY hh:mm"))
        const [hours, minutes] = logDuration.split(":");
        const endTime = moment(logDate, "MM/DD/YY").add(hours, "hours").add(minutes, "minutes");
        // console.log('end moment', endTime);
        console.log('end format', moment(endTime).format("MM/DD/YY hh:mm"));
        // console.log('date value end value', moment(routineDates[0]).valueOf(), moment(endTime).valueOf());
    }
    render(){
        const {routine, activeExercises, finishedExercises, viewWorkout, selectRoutineModal, routinesForDay, addExerciseModal, selectedView, routineDates} = this.state;
        const {routineTemplates, exerciseTemplates, routines, loading, ...data} = this.props;
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
                        
                        <TabBar 
                            selectedView={selectedView}
                            toggleView={this.toggleView}
                        />
                        <div className='section-title'>
                            <h1 className="workout--h1">Workouts</h1>
                            <AddIcon label="Add Workout" clickHandler={this.openSelectRoutineModal} />
                            {/* <button onClick={this.openSelectRoutineModal} label="Add Workout" className="button">
                                Add Workout
                            </button> */}
                        </div>
                        {/* <div>
                            View:
                            <div className="toggle">
                                <div className={`thumb ${selectedView === "List View" ? "toggled" : ""}`}>{selectedView.split(" ")[0]}</div>
                                <div className="toggle-text--left" onClick={this.toggleView("Calendar View")}>Calendar</div>
                                <div className="toggle-text--right" onClick={this.toggleView("List View")}>List</div>
                            </div>
                        </div> */}
                        {/* <div className="toggle__container">
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
                        </div> */}
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
                        {/* <form noValidate className="boxed-view__form">
                            <button onClick={this.openSelectRoutineModal} className="button">Start new Workout</button>
                        </form>  */}
                    </React.Fragment >
                }
                {viewWorkout && routine !== null && routine._id &&
                    <ViewWorkout
                        routine={routine}
                        cancelViewWorkout={this.cancelViewWorkout}
                        activeExercises={activeExercises}
                        startExercise={this.startExercise}
                        addSet={this.addSet}
                        finishExercise={this.finishExercise}
                        finishedExercises={finishedExercises}
                        updateSetByIncrement={this.updateSetByIncrement}
                        refetch={() => {}}
                        deleteSet={this.deleteSet}
                        editExercise={this.editExercise}
                        deleteExercise={this.deleteExercise}
                        cancelViewWorkout={this.cancelViewWorkout}
                    />
                }
                {!viewWorkout && routine !== null && routine._id &&
                    <Query query={routineQuery} variables={{_id: routine._id}}>
                        {({loading, error, data, refetch}) => {
                            if (loading) return <div>Loading</div>;
                            if (error) return <div>{error}</div>;
                            const {logged} = data.routine;
                            const {logDate, logDuration} = this.state;
                            return (
                                <React.Fragment>
                                    <div className="section-title">
                                        <h1 className="workout--h1">{routine.name}</h1>
                                        <button onClick={this.toggleAddExercise} className="button button--link-text">
                                            <AddCircle className="icon"/>
                                            Add Exercise
                                        </button>
                                    </div>
                                    {logged &&
                                        <WorkoutDate
                                            date={logDate}
                                            duration={logDuration}
                                            onSelectDate={this.onSelectLogDate}
                                            onSelectDuration={this.onSelectLogDuration}
                                        />
                                    }
                                    <hr/>
                                    <Exercises
                                        date={routineDates[0]}
                                        exercises={data.routine.exercises}
                                        startExercise={this.startExercise}
                                        activeExercises={activeExercises}
                                        logged={logged}
                                        addSet={this.addSet}
                                        addedSetId={this.state.addedSetId}
                                        finishExercise={this.finishExercise}
                                        finishedExercises={this.state.finishedExercises}
                                        cancelExercise={this.cancelExercise}
                                        updateSetByIncrement={this.updateSetByIncrement}
                                        refetch={refetch}
                                        editExercise={this.editExercise}
                                        deleteSet={this.deleteSet}
                                    />
                                    <form noValidate className="boxed-view__form">
                                        <button
                                            onClick={this.finishWorkout}
                                            type="submit"
                                            className={`button button--margin-top`}
                                        >
                                            {logged ? "Log Workout" : "Finish Workout"}
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
}), graphql(startExercise, {
    name: "startExercise"
}), graphql(endExercise, {
    name: "endExercise"
}), graphql(cancelExercise, {
    name: 'cancelExercise'
}),graphql(deleteSet, {
    name: "deleteSet"
}),graphql(endRoutine, {
    name: 'endRoutine',
    options: {
        refetchQueries: ['Routines']
    }
}),graphql(updateSets, {
    name: 'updateSets'
}),graphql(addExercise, {
    name: "addExercise", 
    options: {
        refetchQueries: ['Routines']
    }
}), graphql(deleteExercise, {
    name: 'deleteExercise'
})
)(Workout);