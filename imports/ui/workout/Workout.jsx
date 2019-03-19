import React from 'react';
import SelectRoutine from './SelectRoutine';
import Exercises from './Exercises';
import Routines from './Routines';
import gql from "graphql-tag";
import { Query } from 'react-apollo';
import { graphql, compose } from 'react-apollo';
import AddCircle from '@material-ui/icons/AddCircle';
import AddExerciseTemplate from './AddExerciseTemplate';

const createSet = gql`
    mutation createSet($weight: Float!, $reps: Int!, $setNumber: Int!, $exerciseId: String!) {
        createSet(weight: $weight, reps: $reps, setNumber: $setNumber, exerciseId: $exerciseId){
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
            addExerciseModal: false
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
                    if (lastSet == undefined){
                        activeExercise = {
                            _id: exercise._id,
                            weight: 0,
                            reps: 0,
                            setNumber: 1
                        }
                    } else if (exercise.previousExercise && exercise.previousExercise.sets.length > exercise.sets.length){
                        activeExercise = {
                            _id: exercise._id,
                            ...exercise.previousExercise.sets[exercise.sets.length]
                        }
                    } else {
                        activeExercise = {
                            _id: exercise._id,
                            weight: lastSet.weight,
                            reps: lastSet.reps,
                            setNumber: exercise.sets.length
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
        console.log('e',e)
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
            console.log('deleteSet', data)
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
                setNumber,
                exerciseId: this.state.activeExercise._id
            }
        }).then(({data}) => {
            // console.log('previousExercise', previousExercise, previousExercise.sets.length > setNumber, previousExercise.sets[setNumber] )
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

    finishExercise = (refetch) => (e) => {
        e.preventDefault();
        const {weight, reps, setNumber} = this.state.activeExercise;
        this.props.createSet({
            variables: {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                setNumber,
                exerciseId: this.state.activeExercise._id
            }
        }).then(({data}) => {
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
        }).catch((error) => {
            console.log('createSet', error);
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

    render(){
        const {routine, activeExercise, finishedExercises, selectRoutineModal, addExerciseModal} = this.state;
        const {routineTemplates, exerciseTemplates, routines, loading, ...data} = this.props;
        console.log(data);
        if (loading) return <div>Loading...</div>
        return (
            <React.Fragment>
                {routine === null &&
                    <React.Fragment>
                        <div className='section-title'>
                            <h1>Workouts</h1>
                            <button onClick={this.openSelectRoutineModal} className="button button--link-text">
                                <AddCircle className="icon" />
                                Add Workout
                            </button>
                        </div>
                        <Routines routines={routines} />
                        {/* <form noValidate className="boxed-view__form">
                            <button onClick={this.openSelectRoutineModal} className="button">Start new Workout</button>
                        </form> */}
                    </React.Fragment>
                }
                {routine !== null && routine._id &&
                    <Query query={routineQuery} variables={{_id: routine._id}}>
                        {({loading, error, data, refetch}) => {
                            if (loading) return <div>Loading</div>;
                            if (error) return <div>{error}</div>;
                            return (
                                <React.Fragment>
                                    <div className="section-title">
                                        <h1>{routine.name}</h1>
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