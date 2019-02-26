import React from 'react';
import SelectRoutine from './SelectRoutine';
import Exercise from './Exercise';
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
            finishedExercises: []
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
            console.log('startExercise', data)
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
            console.log('createSet', data);
            this.setState((prevState) => ({
                activeExercise: {
                    _id: prevState.activeExercise._id,
                    weight: 0,
                    reps: 0,
                    setNumber: prevState.activeExercise.setNumber + 1,
                }
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
            console.log('endRoutine', data);
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
            console.log('createSet', data);
            this.props.endExercise({
                variables: {
                    _id: this.state.activeExercise._id
                }
            }).then(({data}) => {
                console.log('endExercise', data)
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
        const {routine, activeExercise, finishedExercises, selectRoutineModal} = this.state;
        const {routineTemplates, routines} = this.props;
        return (
            <React.Fragment>
                {routine === null &&
                    <React.Fragment>
                        <h1>Workout</h1>
                        <button onClick={this.openSelectRoutineModal} className="button">Start new Workout</button>
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
                                    {data.routine.exercises.map(exercise => (
                                        <Exercise
                                            refetch={refetch}
                                            exercise={exercise}
                                            activeExercise={activeExercise}
                                            startExercise={this.startExercise}
                                            addSet={this.addSet}
                                            finishExercise={this.finishExercise}
                                            finishedExercises={finishedExercises}
                                            onChange={this.onChange}
                                        />
                                    ))}
                                    <button onClick={this.finishWorkout} className="button">Finish Workout</button>
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
    name: 'endRoutine'
})
)(Workout);