import React from 'react';
import Routine from './Routine';
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import Exercises from './Exercises';

const createRoutineTemplate = gql`
  mutation createRoutineTemplate($name: String!, $exerciseTemplateIds: [String]) {
    createRoutineTemplate(name: $name, exerciseTemplateIds: $exerciseTemplateIds) {
      _id
    }
  }
`;

class Routines extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            open: false,
            exerciseModal: false,
            exercises: []
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({open: true})
        console.log('clicked');
    }

    saveRoutine = (e) => {
        e.preventDefault();
        this.props.createRoutineTemplate({
            variables: {
                name: this.name.value.trim(),
                exerciseTemplateIds: this.state.exercises.filter(exer => exer._id)
            }
        }).then(({data}) => {
            console.log(data);
        })
        this.setState({open: false})

    }

    handleClick = (exercise) => (e) => {
        e.preventDefault()
        this.setState((prevState) => ({exercises: [...prevState.exercises, exercise], exerciseModal: false}))
    }

    addExercise = (e) => {
        e.preventDefault();
        this.setState({exerciseModal: true})
    }

    render(){
        const {loading, routineTemplates, exercises} = this.props;
        const {open, exerciseModal} = this.state;
        if (loading) return (<div>Loading</div>)
        return (
            <React.Fragment>
                <h1>Routines</h1>
                {routineTemplates && routineTemplates.map(routineTemplate => (<Routine routineTemplate={routineTemplate} />))}
                <form onSubmit={this.onSubmit} noValidate className="boxed-view__form">
                    <button className="button button--margin-top" type="submit">
                        Add Routine
                    </button>
                </form>
                <div className="boxed-view boxed-view--modal" style={{display: open && !exerciseModal ? "flex" : "none"}}>
                    <div className="boxed-view__box">
                        <form onSubmit={this.saveRoutine} noValidate className="boxed-view__form" style={{zIndex: 6}}>
                            <input type="text" ref={el => this.name = el} placeholder="Enter Routine Name"/>
                            <h2>Exercises</h2>
                                {this.state.exercises.map(exercise => (
                                    <h3>{exercise.name}</h3>
                                ))}
                            <button onClick={this.addExercise} className="button button--pill">Add Exercise</button>
                            <button type="submit" className="button">Save Routine</button>
                        </form>
                    </div>
                </div>
                <div className="boxed-view boxed-view--modal" style={{display: exerciseModal ? "flex" : "none"}}>
                    <div className="boxed-view__box">
                        <form noValidate className="boxed-view__form" style={{zIndex: 8}}>
                            <h2>Exercises</h2>
                            {exercises && exercises.map(exercise => (
                                <button onClick={this.handleClick(exercise)} className="button button--pill">{exercise.name}</button>
                            ))}
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default graphql(createRoutineTemplate, {
    name: "createRoutineTemplate",
    options: {
      refetchQueries: ["RoutineTemplates"]
    }
})(Routines);