import React from 'react';
import ExerciseTemplate from './ExerciseTemplate';
import CreateExerciseTemplate from './CreateExerciseTemplate';
import AddCircle from '@material-ui/icons/AddCircle';

class ExerciseTemplates extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            exerciseTemplateModalOpen: false,
            exerciseTemplateToEdit: null
        }
    }
    closeExerciseTemplateModal = () => {
        this.setState({exerciseTemplateModalOpen: false, exerciseTemplateToEdit: null})
    }

    editExerciseTemplate = (exerciseTemplateToEdit) => (e) => {
        e.preventDefault();
        this.setState({exerciseTemplateToEdit, exerciseTemplateModalOpen: true})
    }

    openExerciseTemplateModal = (e) => {
        e.preventDefault();
        this.setState({exerciseTemplateModalOpen: true})
    }

    render(){
        const {loading, exerciseTemplates} = this.props;
        const {exerciseTemplateModalOpen, exerciseTemplateToEdit} = this.state;
        if (loading) return (<div>Loading</div>)
        return (
            <React.Fragment>
                <div className='section-title'>
                    <h1 className="workout--h1">Exercises</h1>
                    <button onClick={this.openExerciseTemplateModal} className="button button--link-text" >
                        <AddCircle className="icon" />
                        Add Exercise
                    </button>
                </div>
                {exerciseTemplates && exerciseTemplates.map(exerciseTemplate => (
                    <ExerciseTemplate editExerciseTemplate={this.editExerciseTemplate} exerciseTemplate={exerciseTemplate} />
                    ))
                }
                {/* <form noValidate className="boxed-view__form">
                    <button onClick={this.openExerciseTemplateModal} className="button button--margin-top" >
                        Add Exercise
                    </button>
                </form> */}
                {exerciseTemplateModalOpen &&
                    <CreateExerciseTemplate
                        exerciseTemplateToEdit={exerciseTemplateToEdit}
                        exerciseTemplates={exerciseTemplates}
                        tags={this.props.tags}
                        closeExerciseTemplateModal={this.closeExerciseTemplateModal}
                    />
                }
            </React.Fragment>
        )
    }
}


export default ExerciseTemplates;