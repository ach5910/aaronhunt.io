import React from 'react';
import ExerciseTemplate from './ExerciseTemplate';
import CreateExercise from './CreateExercise';

class ExerciseTemplates extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            exerciseModalOpen: false,
            exerciseTemplateToEdit: null
        }
    }
    closeExerciseModal = () => {
        this.setState({exerciseModalOpen: false, exerciseTemplateToEdit: null})
    }

    editExerciseTemplate = (exerciseTemplateToEdit) => (e) => {
        e.preventDefault();
        this.setState({exerciseTemplateToEdit, exerciseModalOpen: true})
    }

    openExerciseModal = (e) => {
        e.preventDefault();
        this.setState({exerciseModalOpen: true})
        console.log('clicked');
    }

    render(){
        const {loading, exerciseTemplates} = this.props;
        const {exerciseModalOpen, exerciseTemplateToEdit} = this.state;
        if (loading) return (<div>Loading</div>)
        return (
            <React.Fragment>
                <h1>Exercises</h1>
                {exerciseTemplates && exerciseTemplates.map(exerciseTemplate => (
                    <ExerciseTemplate editExerciseTemplate={this.editExerciseTemplate} exerciseTemplate={exerciseTemplate} />
                    ))
                }
                <form noValidate className="boxed-view__form">
                    <button onClick={this.openExerciseModal} className="button button--margin-top" >
                        Add Exercise
                    </button>
                </form>
                {exerciseModalOpen &&
                    <CreateExercise
                        exerciseTemplateToEdit={exerciseTemplateToEdit}
                        exerciseTemplates={exerciseTemplates}
                        tags={this.props.tags}
                        closeExerciseModal={this.closeExerciseModal}
                    />
                }
            </React.Fragment>
        )
    }
}


export default ExerciseTemplates;