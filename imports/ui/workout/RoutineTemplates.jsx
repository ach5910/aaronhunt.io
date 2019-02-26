import React from 'react';
import gql from "graphql-tag";
import { graphql } from 'react-apollo';
import RoutineTemplate from './RoutineTemplate';
import CreateRoutineTemplate from './CreateRoutineTemplate';
import ConfirmationModal from './ConfirmationModal';

const deleteRoutineTemplate = gql`
  mutation deleteRoutineTemplate($_id: String!) {
    deleteRoutineTemplate(_id: $_id)
  }
`;

class RoutineTemplates extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            addRoutine: false,
            searchExercise: "",
            deleteModalOpen: false,
            routineTemplateToDelete: {},
            routineTemplateToEdit: null
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({addRoutine: true})
        console.log('clicked');
    }

    closeAddRoutineModal = () => {
        this.setState({addRoutine: false, routineTemplateToEdit: null});
    }

    deleteRoutineTemplate = (routineTemplateToDelete) => (e) => {
        e.preventDefault();
        this.setState({routineTemplateToDelete, deleteModalOpen: true})
    }

    editRoutineTemplate = (routineTemplateToEdit) => (e) => {
        this.setState({routineTemplateToEdit, addRoutine: true})
    }

    submitDeleteRoutineTemplate = (e) => {
        e.preventDefault();
        this.props.deleteRoutineTemplate({
            variables: {
                _id: this.state.routineTemplateToDelete._id
            }
        }).then(({data}) => {
            console.log(data);
            this.setState({routineTemplateToDelete: {}, deleteModalOpen: false})
        }).catch((error) => {
            console.log(error)
        })
    }

    cancelDeleteRoutineTemplate = (e) => {
        e.preventDefault();
        this.setState({routineTemplateToDelete: {}, deleteModalOpen: false})
    }

    render(){
        const {loading, routineTemplates, exerciseTemplates} = this.props;
        const {addRoutine, routineTemplateToDelete, deleteModalOpen, routineTemplateToEdit} = this.state;
        if (loading) return (<div>Loading</div>)
        return (
            <React.Fragment>
                <h1>Routines</h1>
                {routineTemplates && routineTemplates.map(routineTemplate => (
                    <RoutineTemplate 
                        routineTemplate={routineTemplate}
                        deleteRoutineTemplate={this.deleteRoutineTemplate}
                        editRoutineTemplate={this.editRoutineTemplate}
                    />
                    ))}
                <form onSubmit={this.onSubmit} noValidate className="boxed-view__form">
                    <button className="button button--margin-top" type="submit">
                        Add Routine
                    </button>
                </form>
                {addRoutine &&
                    <CreateRoutineTemplate 
                        routineTemplates={routineTemplates}
                        exerciseTemplates={exerciseTemplates}
                        closeAddRoutineModal={this.closeAddRoutineModal}
                        routineTemplateToEdit={routineTemplateToEdit}
                    />
                }
                {deleteModalOpen &&
                    <ConfirmationModal
                        onSubmit={this.submitDeleteRoutineTemplate}
                        onCancel={this.cancelDeleteRoutineTemplate}
                        value={routineTemplateToDelete.name}
                        action="delete"
                    />
                }
            </React.Fragment>
        )
    }
}


export default graphql(deleteRoutineTemplate, {
    name: "deleteRoutineTemplate",
    options: {
      refetchQueries: ["RoutineTemplates"]
    }
})(RoutineTemplates);