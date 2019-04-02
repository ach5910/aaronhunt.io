import React from 'react';
import Cancel from '@material-ui/icons/Cancel';
import { rabinKarp } from '../../startup/client/utils';

class AddExerciseTemplate extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            searchName: ""
        }
    }

    updateSearchName = (e) => {
        e.preventDefault();
        this.setState({searchName: e.target.value})
    }

    render(){
        const {searchName} = this.state;
        const {exerciseTemplates, closeAddExerciseTemplateModal, selectExerciseTemplate} = this.props;
        return (
            <div className="boxed-view boxed-view--modal">
                <div className="page-content page-content--modal">
                    <div className="boxed-view__box boxed-view--modal-item">
                        <form noValidate className="boxed-view__form" style={{zIndex: 8}}>
                            <h2 className="workout--h2">Exercises</h2>
                            <input type="text" value={searchName} onChange={this.updateSearchName} placeholder="Search Exercise"/>
                            <ul className="workout--list">
                                {exerciseTemplates && exerciseTemplates.filter(exer => rabinKarp(searchName.toLowerCase(), exer.name.toLowerCase())).map(exerciseTemplate => (
                                    <li onClick={selectExerciseTemplate(exerciseTemplate)} >{exerciseTemplate.name}</li>
                                ))}
                            </ul>
                        </form>
                        <div className="modal__cancel-box">
                            <Cancel onClick={closeAddExerciseTemplateModal} className="icon"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddExerciseTemplate;