import React from 'react';
import gql from "graphql-tag";
import { graphql, compose} from "react-apollo";
import Chip from '../Components/Chip';
import AddCircle from '@material-ui/icons/AddCircle';
import Cancel from '@material-ui/icons/Cancel';
import AddTag from './AddTag';

const createExerciseTemplate = gql`
  mutation createExerciseTemplate($name: String!, $tagIds: [String!]) {
    createExerciseTemplate(name: $name, tagIds: $tagIds) {
      _id
    }
  }
`;

const updateExerciseTemplate = gql`
    mutation updateExerciseTemplate($_id: String!, $name: String!, $tagIds: [String!]){
        updateExerciseTemplate(_id: $_id, name: $name, tagIds: $tagIds){
            _id,
            name
        }
    }
`

class CreateExerciseTemplate extends React.Component{
    constructor(props){
        super(props)
        const {exerciseTemplateToEdit} = props;
        this.state = {
            tagModalOpen: false,
            tags: exerciseTemplateToEdit && exerciseTemplateToEdit.tags ? exerciseTemplateToEdit.tags : [],
            error: "",
        }
    }

    componentDidMount = () => {
        if (this.props.exerciseTemplateToEdit){
            this.name.value = this.props.exerciseTemplateToEdit.name;
        }
    }

    selectTag = (tag) => {
        const unique = this.state.tags.reduce((accum, _tag) => (accum && _tag._id !== tag._id), true)
        if (unique){
            this.setState((prevState) => ({
                tags: [...prevState.tags, tag],
                tagModalOpen: false
            }))
        }
    }

    deleteTag = (tag) => {
        const newTags = this.state.tags.filter(_tag => _tag._id !== tag._id)
        this.setState({tags: newTags})
    }

    openTagModal = (e) => {
        e.preventDefault()
        this.setState({tagModalOpen: true})
    }

    closeAddTagModal = (e) => {
        e.preventDefault();
        this.setState({tagModalOpen: false})
    }

    saveExerciseTemplate = (e) => {
        e.preventDefault();
        const name = this.name.value.trim();
        const editName = this.props.exerciseTemplateToEdit ? this.props.exerciseTemplateToEdit.name : "";
        const unique = this.props.exerciseTemplates.reduce((accum, exer) => 
            (accum && (exer.name !== name || name === editName)), true)
        if (name.length > 2 && unique){
            if (this.props.exerciseTemplateToEdit){
                this.props.updateExerciseTemplate({
                    variables: {
                        _id: this.props.exerciseTemplateToEdit._id,
                        name,
                        tagIds: this.state.tags.map(tag => tag._id)
                    }
                }).then(({data}) => {
                    console.log('updateExerciseTemplate', data);
                    this.name.value = "";
                    this.setState({error: ""})
                    this.props.closeExerciseTemplateModal();
                }).catch((error) => {
                    console.log('updateExerciseTemplate', error)
                    this.setState({error: ""})
                })
            } else {
                this.props.createExerciseTemplate({
                    variables: {
                        name,
                        tagIds: this.state.tags.map(tag => tag._id)
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.name.value = "";
                    this.setState({error: ""})
                    this.props.closeExerciseTemplateModal()
                }).catch((error) => {
                    console.log('saveExerciseTemplate', error)
                    this.setState({error: ""})
                })
            }
        } else {
            this.setState({error: "Exercise name must be unique and at least three character long"})
        }
    }

    render(){
        return (
            <React.Fragment>
                <div className="boxed-view boxed-view--modal" style={{display: !this.state.tagModalOpen ? "flex" : "none"}}>
                    <div className="page-content page-content--modal">
                        <div className="boxed-view__box boxed-view--modal-item">
                            <h1>Create Exercise</h1>
                            {this.state.error !== "" && <span style={{color: 'red'}}>{this.state.error}</span>}
                            <form noValidate className="boxed-view__form" style={{zIndex: 6}}>
                                <input type="text" ref={el => this.name = el} placeholder="Enter Exercise Name"/>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <h2>Tags</h2>
                                    <button onClick={this.openTagModal} className="button button--link-text" type="submit">
                                        <AddCircle className="icon" />
                                        Add Tag
                                    </button>
                                </div>
                                <div style={{marginBottom: '1.4rem'}}>
                                    {this.state.tags.length > 0
                                        ? this.state.tags.map(tag => (<Chip name={tag.name} value={tag} deleteable onDelete={this.deleteTag} />))
                                        : <h3>No tags have been added to this exercise yet</h3>
                                    }
                                </div>
                                <button onClick={this.saveExerciseTemplate} className="button">Save Exercise</button>
                            </form>
                            <div className="modal__cancel-box">
                                <Cancel onClick={() => {this.props.closeExerciseTemplateModal()}} className="icon"/>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.tagModalOpen &&
                    <AddTag 
                        tags={this.props.tags}
                        selectTag={this.selectTag}
                        closeAddTagModal={this.closeAddTagModal}
                    />
                }
            </React.Fragment>
        )
    }
}

export default compose( graphql(
    createExerciseTemplate, {
        name: "createExerciseTemplate",
        options: {
            refetchQueries: ["ExerciseTemplates", "Tags"]
}}),graphql(
    updateExerciseTemplate, {
        name: "updateExerciseTemplate",
        options: {
            refetchQueries: ["ExerciseTemplates"]
}}))(CreateExerciseTemplate);