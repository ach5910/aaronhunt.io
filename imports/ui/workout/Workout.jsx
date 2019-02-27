import React from 'react';
import SelectRoutine from './SelectRoutine';
import Exercises from './Exercises';
import Routines from './Routines';
import gql from "graphql-tag";
import { Query } from 'react-apollo';
import { graphql, compose } from 'react-apollo';

const createSet = gql`
    mutation createSet($weight: Float!, $reps: Int!, $setNumber: Int!, $exerciseId: String!) {
        createSet(weight: $weight, reps: $reps, setNumber: $setNumber, exerciseId: $exerciseId){
            _id,
            orm
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
          weight
          reps
          orm
          setNumber
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
    
    startExercise = (_id) => (e) => {
        e.preventDefault();
        this.props.startExercise({
            variables: {
                _id
            }
        }).then(({data}) => {
            this.setState({
                activeExercise: {
                    _id,
                    weight: 0,
                    reps: 0,
                    setNumber: 1,
                }
            })
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

    addSet = (refetch) => (e) => {
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
            this.setState((prevState) => ({
                activeExercise: {
                    _id: prevState.activeExercise._id,
                    weight,
                    reps,
                    setNumber: prevState.activeExercise.setNumber + 1,
                },
                newSet: true
            }))
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

    render(){
        const {routine, activeExercise, finishedExercises, selectRoutineModal, newSet} = this.state;
        const {routineTemplates, routines, loading, ...data} = this.props;
        console.log(data);
        if (loading) return <div>Loading...</div>
        return (
            <React.Fragment>
                {routine === null &&
                    <React.Fragment>
                        <h1>Workout</h1>
                        <Routines routines={routines} />
                        <form noValidate className="boxed-view__form">
                            <button onClick={this.openSelectRoutineModal} className="button">Start new Workout</button>
                        </form>
                    </React.Fragment>
                }
                {routine !== null && routine._id &&
                    <Query query={routineQuery} variables={{_id: routine._id}}>
                        {({loading, error, data, refetch}) => {
                            if (loading) return <div>Loading</div>;
                            if (error) return <div>{error}</div>;
                            return (
                                <React.Fragment>
                                    <h1>{routine.name}</h1>
                                    <Exercises
                                        exercises={data.routine.exercises}
                                        startExercise={this.startExercise}
                                        activeExercise={activeExercise}
                                        addSet={this.addSet}
                                        finishExercise={this.finishExercise}
                                        finishedExercises={this.state.finishedExercises}
                                        onChange={this.onChange}
                                        refetch={refetch}
                                    />
                                    {activeExercise === null &&
                                        <form noValidate className="boxed-view__form">
                                            <button onClick={this.finishWorkout} type="submit" className="button button--margin-top">Finish Workout</button>
                                        </form>
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
    name: "createRoutine"
}), 
graphql(startExercise, {
    name: "startExercise"
}), graphql(endExercise, {
    name: "endExercise"
}),
graphql(endRoutine, {
    name: 'endRoutine',
    options: {
        refetchQueries: ['getMostRecentRoutine' , 'Routines']
    }
})
)(Workout);