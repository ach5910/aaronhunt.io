import React from 'react';
import Exercise from './Exercise';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Chip from '../Components/Chip';

const createExerciseTemplate = gql`
  mutation createExerciseTemplate($name: String!, $tagIds: [String!]) {
    createExerciseTemplate(name: $name, tagIds: $tagIds) {
      _id
    }
  }
`;

const createTag = gql`
    mutation createTag($name: String!){
        createTag(name: $name){
            _id,
            name
        }
    }
`

class Exercises extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            open: false,
            createTag: false,
            tags: []
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({open: true})
        console.log('clicked');
    }
    addTag = (tag) => {
        this.setState((prevState) => ({tags: [...prevState.tags, tag]}))
    }

    deleteTag = (tag) => {
        const newTags = this.state.tags.filter(_tag => _tag._id !== tag._id)
        this.setState({tags: newTags})
    }

    openTagModal = (e) => {
        e.preventDefault()
        this.setState({createTag: true})
    }

    saveExercise = (e) => {
        e.preventDefault();
        this.props.createExerciseTemplate({
            variables: {
                name: this.name.value.trim(),
                tagIds: this.state.tags.map(tag => tag._id)
            }
        }).then(({data}) => {
            console.log(data);
            this.name.value = "";
        }).catch((error) => {
            console.log('saveExercise', error)
        })
        this.setState({open: false})

    }

    saveTag = (e) => {
        e.preventDefault();
        this.props.createTag({
            variables: {
                name: this.tagName.value.trim()
            }
        }).then(({data}) => {
            this.tagName.value = "";
            console.log('createTag', data)
            const newTag = {
                name: data.createTag.name,
                _id: data.createTag._id
            }
            this.setState((prevState) => ({tags: [...prevState.tags, newTag], createTag: false}))
        }).catch(error => {
            console.log('saveTag');
            console.log(error)
            this.setState({createTag: false})
        })
    }

    render(){
        const {loading, exerciseTemplates, tags} = this.props;
        const {open} = this.state;
        console.log('state tags', this.state.tags)
        if (loading) return (<div>Loading</div>)
        return (
            <React.Fragment>
                <h1>Exercises</h1>
                {exerciseTemplates && exerciseTemplates.map(exerciseTemplate => (
                    <Exercise exerciseTemplate={exerciseTemplate} />
                    ))
                }
                <form noValidate className="boxed-view__form">
                    <button onClick={this.onSubmit} className="button button--margin-top" >
                        Add Exercise
                    </button>
                </form>
                <div className="boxed-view boxed-view--modal" style={{display: open && !this.state.createTag ? "flex" : "none"}}>
                    <div className="boxed-view__box">
                        <form noValidate className="boxed-view__form" style={{zIndex: 6}}>
                            <input type="text" ref={el => this.name = el} placeholder="Enter Exercise Name"/>
                            <h2>Tags</h2>
                            <div className="boxed-view__box boxed-view__box--container">
                                {this.state.tags && this.state.tags.map(tag => (
                                    <Chip name={tag.name} value={tag} deleteable onDelete={this.deleteTag} />
                                ))}
                            </div>
                            <button className="button button--pill" onClick={this.openTagModal}>+</button>
                            <h2>All Tags</h2>
                            <div className="boxed-view__box boxed-view__box--container">
                                {tags && tags.map(tag => (
                                    <Chip name={tag.name} value={tag} handleClick={this.addTag} />
                                ))}
                            </div>
                            <button onClick={this.saveExercise} className="button">Save Exercise</button>
                        </form>
                    </div>
                </div>
                <div className="boxed-view boxed-view--modal" style={{display: this.state.createTag ? "flex" : "none"}}>
                    <div className="boxed-view__box">
                        <form noValidate className="boxed-view__form" style={{zIndex: 8}}>
                            <input type="text" ref={el => this.tagName = el} placeholder="Enter Tag Name"/>
                            <button onClick={this.saveTag} className="button">Save Tag</button>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default compose(
    graphql(createExerciseTemplate, {
    name: "createExerciseTemplate",
    options: {
        refetchQueries: ["ExerciseTemplates", "Tags"]
}}),
    graphql(createTag, {
    name: "createTag",
    options: {
        refetchQueries: ["Tags"]
    }  
}))(Exercises);