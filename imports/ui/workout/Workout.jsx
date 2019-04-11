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
            _id,
            orm
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
        deleteSet(_id: $_id)
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
    mutation startExercise($_id: String!){
        startExercise(_id: $_id){
            _id
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

class Workout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            routine: null,
            selectRoutineModal: false,
            activeExercise: null,
            finishedExercises: [],
            addExerciseModal: false,
            selectedView: "Calendar View",
            routineDates: [],
            routinesForDay: [],
            viewWorkout: false,

        }
    }

    componentDidMount = () => {
        this.loadWorkout();
    }

    loadWorkout = () => {
        const {getMostRecentRoutine, loading} = this.props;
        if(!loading && getMostRecentRoutine && getMostRecentRoutine.startTime && getMostRecentRoutine.endTime === null && this.state.routine === null){
            const finishedExercises = getMostRecentRoutine.exercises.filter(exercise => exercise.endTime !== null).map(exercise => exercise._id)
            let activeExercise = null;
            getMostRecentRoutine.exercises.forEach(exercise => {
                if (exercise.startTime !== null && exercise.endTime === null){
                    const tempSets = [...exercise.sets];
                    const lastSet = tempSets.pop();
                    if (exercise.previousExercise && exercise.previousExercise.sets.length > exercise.sets.length){
                        activeExercise = {
                            _id: exercise._id,
                            ...exercise.previousExercise.sets[exercise.sets.length]
                        }
                    }else if (lastSet == undefined){
                        activeExercise = {
                            _id: exercise._id,
                            weight: 0,
                            reps: 0,
                            setNumber: 1
                        }
                    } else {
                        activeExercise = {
                            _id: exercise._id,
                            weight: lastSet.weight,
                            reps: lastSet.reps,
                            setNumber: exercise.sets.length + 1
                        }
                    }
                }
            })
            this.setState({
                routine: getMostRecentRoutine,
                activeExercise,
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
    
    startExercise = (_id, previousExercise = null) => (e) => {
        e.preventDefault();
        this.props.startExercise({
            variables: {
                _id
            }
        }).then(({data}) => {
            if (previousExercise && previousExercise.sets.length > 0){
                this.setState({
                    activeExercise: {
                        _id,
                        ...previousExercise.sets[0]
                    }
                })
            } else {
                this.setState({
                    activeExercise: {
                        _id,
                        weight: 0,
                        reps: 0,
                        setNumber: 1,
                    }
                })
            }
        }).catch((error) => {
            console.log('startExercise', error)
        })
    }

    onChange = (field) => (e) => {
        e.preventDefault();
        e.persist();
        this.setState((prevState) => ({
            activeExercise: {
                ...prevState.activeExercise,
                [field]: e.target.value
            }
        }))
    }

    deleteSet = (setId, refetch) => {
        this.props.deleteSet({
            variables: {
                _id: setId
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                activeExercise: {
                    ...prevState.activeExercise,
                    setNumber: prevState.activeExercise.setNumber - 1
                }
            }))
            refetch();
        }).catch((error) => {
            console.log('deleteSet', error)
        })
    }

    startEdittingSet = (set) => {
        this.setState((prevState) => ({
            activeExercise: {
                _id: prevState.activeExercise._id,
                weight: set.weight,
                reps: set.reps,
                setNumber: prevState.activeExercise.setNumber
            },
            edittingSet: true
        }))
    }
    editSet = (setId, refetch) => {
        const {weight, reps} = this.state.activeExercise;
        this.props.editSet({
            variables: {
                _id: setId,
                weight: parseFloat(weight),
                reps: parseInt(reps)
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                activeExercise: {
                    _id: prevState.activeExercise._id,
                    weight,
                    reps,
                    setNumber: prevState.activeExercise.setNumber
                }
            }))
            refetch();
        }).catch((error) => {
            console.log('editSet', error);
        })
    }

    addSet = (refetch, previousExercise = null) => (e) => {
        e.preventDefault();
        const {weight, reps, setNumber} = this.state.activeExercise;
        this.props.createSet({
            variables: {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                // setNumber,
                exerciseId: this.state.activeExercise._id
            }
        }).then(({data}) => {
            if (previousExercise && previousExercise.sets.length > setNumber){
                this.setState((prevState) => ({
                    activeExercise: {
                        _id: prevState.activeExercise._id,
                        ...previousExercise.sets[setNumber]
                    }
                }))
            } else {
                this.setState((prevState) => ({
                    activeExercise: {
                        _id: prevState.activeExercise._id,
                        weight,
                        reps,
                        setNumber: prevState.activeExercise.setNumber + 1,
                    }
                }))
            }
            refetch();
        }).catch((error) => {
            console.log('createSet', error);
        })
    }

    finishWorkout = (e) => {
        e.preventDefault();
        this.props.endRoutine({
            variables: {
                _id: this.state.routine._id
            }
        }).then(({data}) => {
            this.setState({
                routine: null,
                activeExercise: null,
                finishedExercises: []
            })
        }).catch((error) => {
            console.log('endRoutine', error);
        })
    }

    finishExercise = (refetch, setActive) => (e) => {
        e.preventDefault();
        if (setActive){
            this.finishSetEndExercise(refetch);
        } else {
            this.endExercise(refetch);
        }
    }

    finishSetEndExercise = (refetch) => {
        const {weight, reps, setNumber} = this.state.activeExercise;
        this.props.createSet({
            variables: {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                // setNumber,
                exerciseId: this.state.activeExercise._id
            }
        }).then(({data}) => {
            this.endExercise(refetch);
        }).catch((error) => {
            console.log('createSet', error);
        })
    }

    endExercise = (refetch) => {
        this.props.endExercise({
            variables: {
                _id: this.state.activeExercise._id
            }
        }).then(({data}) => {
            this.setState((prevState) => ({
                finishedExercises: [...prevState.finishedExercises, prevState.activeExercise._id],
                activeExercise: null
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
        const {routine, activeExercise, finishedExercises, viewWorkout, selectRoutineModal, routinesForDay, addExerciseModal, selectedView, routineDates} = this.state;
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
                            activeExercise={activeExercise}
                            addSet={this.addSet}
                            finishExercise={this.finishExercise}
                            finishedExercises={this.state.finishedExercises}
                            onChange={this.onChange}
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
                                    <Exercises
                                        exercises={data.routine.exercises}
                                        startExercise={this.startExercise}
                                        activeExercise={activeExercise}
                                        addSet={this.addSet}
                                        finishExercise={this.finishExercise}
                                        finishedExercises={this.state.finishedExercises}
                                        onChange={this.onChange}
                                        refetch={refetch}
                                        editSet={this.editSet}
                                        deleteSet={this.deleteSet}
                                        startEdittingSet={this.startEdittingSet}
                                    />
                                    {activeExercise === null &&
                                        <form noValidate className="boxed-view__form">
                                            <button onClick={this.finishWorkout} type="submit" className="button button--margin-top">Finish Workout</button>
                                        </form>
                                    }
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
                {selectRoutineModal && 
                    <SelectRoutine 
                        routineTemplates={routineTemplates} 
                        closeSelectRoutineModal={this.closeSelectRoutineModal}
                        selectRoutine={this.selectRoutine}
                    />
                }
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
graphql(addExercise, {
    name: "addExercise", 
    options: {
        refetchQueries: ['Routines']
    }
})
)(Workout);