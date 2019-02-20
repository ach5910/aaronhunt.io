import React from 'react';
import Cancel from '@material-ui/icons/Cancel';
import { rabinKarp } from '../../startup/client/utils';

class AddExercise extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            searchExercise: ""
        }
    }

    updateSearchExercise = (e) => {
        e.preventDefault();
        this.setState({searchExercise: e.target.value})
    }

    render(){
        const {searchExercise} = this.state;
        const {exercises, closeAddExerciseModal, selectExercise} = this.props;
        return (
            <div className="boxed-view boxed-view--modal">
                <div className="page-content page-content--modal">
                    <div className="boxed-view__box boxed-view--modal-item">
                        <form noValidate className="boxed-view__form" style={{zIndex: 8}}>
                            <h2>Exercises</h2>
                            <input type="text" value={searchExercise} onChange={this.updateSearchExercise} placeholder="Search Exercise"/>
                            <ul>
                                {exercises && exercises.filter(exer => rabinKarp(searchExercise.toLowerCase(), exer.name.toLowerCase())).map(exercise => (
                                    <li onClick={selectExercise(exercise)} >{exercise.name}</li>
                                ))}
                            </ul>
                        </form>
                        <div className="modal__cancel-box">
                            <Cancel onClick={closeAddExerciseModal} className="icon"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddExercise;