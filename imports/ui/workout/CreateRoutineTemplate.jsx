import React from 'react';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import AddCircle from '@material-ui/icons/AddCircle';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Cancel from '@material-ui/icons/Cancel';
import AddExercise from './AddExercise';

const createRoutineTemplate = gql`
  mutation createRoutineTemplate($name: String!, $exerciseTemplateIds: [String]) {
    createRoutineTemplate(name: $name, exerciseTemplateIds: $exerciseTemplateIds) {
      _id
    }
  }
`;

const updateRoutineTemplate = gql`
    mutation updateRoutineTemplate($_id: String!, $name: String!, $exerciseTemplateIds: [String!]){
        updateRoutineTemplate(_id: $_id, name: $name, exerciseTemplateIds:$exerciseTemplateIds){
            _id,
            name,
        }
    }
`

class CreateRoutine extends React.Component {
    constructor(props){
        super(props);
        const {routineTemplateToEdit} = props;
        this.state ={
            exerciseModal: false,
            routineTemplate: props.routineTemplateToEdit,
            exerciseTemplates: routineTemplateToEdit && routineTemplateToEdit.exerciseTemplates 
                ? routineTemplateToEdit.exerciseTemplates
                : [],
            error: ""
        }
    }

    componentDidMount = () => {
        if (this.state.routineTemplate){
            this.name.value = this.state.routineTemplate.name;
        }
    }

    saveRoutine = (e) => {
        console.log('saveRoutine', e);
        e.preventDefault();
        const name = this.name.value.trim();
        const editName = this.props.routineTemplateToEdit ? this.props.routineTemplateToEdit.name : "";
        const unique = this.props.routineTemplates.reduce((accum, rout) => (accum && (rout.name !== name || editName === name)), true)
        if (name.length > 2 && unique){
            const {routineTemplate} = this.state;
            if (routineTemplate){
                this.props.updateRoutineTemplate({
                    variables: {
                        _id: routineTemplate._id,
                        name,
                        exerciseTemplateIds: this.state.exerciseTemplates.map(exer => exer._id)

                    }
                }).then(({data}) => {
                    console.log('update routine template', data);
                    this.name.value = "";
                }).catch((error) => {
                    console.log('update routine template', error);
                })
            } else {
                this.props.createRoutineTemplate({
                    variables: {
                        name,
                        exerciseTemplateIds: this.state.exerciseTemplates.map(exer => exer._id)
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.name.value = "";
                }).catch((error) => {
                    console.log('create routine template', error)
                })
                // this.setState({open: false, error: ""})
            }
            this.props.closeAddRoutineModal();
        }else {
            this.setState({error: "You must specify unique routine name"})
        }


    }

    removeExercise = (_id) => (e) => {
        e.preventDefault();
        this.setState((prevState) => ({
            exerciseTemplates: prevState.exerciseTemplates.filter(exercise => exercise._id !== _id)
        }))
    }

    addExercise = (e) => {
        e.preventDefault();
        this.setState({exerciseModal: true})
    }

    closeAddExerciseModal = (e) => {
        e.preventDefault();
        this.setState({exerciseModal: false})
    }

    changeExerciseOrder = (idx, newIdx) => (e) => {
        e.preventDefault();
        const newExercises = [...this.state.exerciseTemplates];
        const exerciseToMove = newExercises[idx];
        newExercises[idx] = newExercises[newIdx];
        newExercises[newIdx] = exerciseToMove
        this.setState({exerciseTemplates: newExercises})
    }

    selectExercise = (exercise) => (e) => {
        e.preventDefault()
        this.setState((prevState) => ({exerciseTemplates: [...prevState.exerciseTemplates, exercise], exerciseModal: false}))
    }

    render(){
        const {exerciseTemplates} = this.props;
        const {exerciseModal, routineTemplate} = this.state;
        const routineExerciseIds = this.state.exerciseTemplates.map(exercise => exercise._id)
        return (
            <React.Fragment>
                <div className="boxed-view boxed-view--modal" style={{display: !exerciseModal ? "flex" : "none"}}>
                    <div className="page-content page-content--modal">
                        <div className="boxed-view__box boxed-view--modal-item">
                            <h1>Create Routine</h1>
                            {this.state.error !== "" && <span style={{color: 'red'}}>{this.state.error}</span>}
                            <form onSubmit={this.saveRoutine} noValidate className="boxed-view__form" style={{zIndex: 6}}>
                                <input type="text" ref={el => this.name = el} placeholder="Enter Routine Name"/>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <h2>Exercises</h2>
                                    <AddCircle onClick={this.addExercise} className="icon" />
                                </div>
                                    {this.state.exerciseTemplates.length > 0 ?
                                        this.state.exerciseTemplates.map((exercise, idx) => (
                                        <div className="item">
                                            <h3>{exercise.name}</h3>
                                            <div className="item__icons">
                                                {idx !== this.state.exerciseTemplates.length - 1 && 
                                                    <ArrowDownward onClick={this.changeExerciseOrder(idx, idx + 1)} className="icon"/>
                                                }
                                                {idx > 0 && 
                                                    <ArrowUpward onClick={this.changeExerciseOrder(idx, idx - 1)} className="icon" />
                                                }
                                                <DeleteForever onClick={this.removeExercise(exercise._id)}className='icon' />
                                            </div>
                                        </div>))
                                        : <h3 style={{marginBottom: '1.4rem'}}>No exercises have been added to this routine yet</h3>
                                    }
                                <button type="submit" className="button">Save Routine</button>
                            </form>
                            <div className="modal__cancel-box">
                                <Cancel onClick={this.props.closeAddRoutineModal}className="icon"/>
                            </div>
                        </div>
                    </div>
                </div>
                {exerciseModal &&
                    <AddExercise 
                        exerciseTemplates={exerciseTemplates.filter(exer => !routineExerciseIds.includes(exer._id))}
                        selectExercise={this.selectExercise}
                        closeAddExerciseModal={this.closeAddExerciseModal}
                    />
                }
            </React.Fragment>
        )
    }
}

export default compose(
    graphql(createRoutineTemplate, {
        name: "createRoutineTemplate",
        options: {
            refetchQueries: ["RoutineTemplates"]
    }
}), graphql(updateRoutineTemplate, {
        name: 'updateRoutineTemplate',
        options: {
            refetchQueries: ["RoutineTemplates"]
    }
})
)(CreateRoutine);