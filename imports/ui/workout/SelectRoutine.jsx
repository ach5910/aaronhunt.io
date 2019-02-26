import React from 'react';
import Cancel from '@material-ui/icons/Cancel';
import { rabinKarp } from '../../startup/client/utils';

class SelectRoutine extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            searchRoutine: "",
        }
    }

    updateSearchRoutine = (e) => {
        e.preventDefault();
        this.setState({searchRoutine: e.target.value})
    }

    render(){
        const {searchRoutine} = this.state;
        const {routineTemplates, closeSelectRoutineModal, selectRoutine} = this.props;
        return (
            <div className="boxed-view boxed-view--modal">
                <div className="page-content page-content--modal">
                    <div className="boxed-view__box boxed-view--modal-item">
                        <form noValidate className="boxed-view__form" style={{zIndex: 8}}>
                            <h2>Routines</h2>
                            <input type="text" value={searchRoutine} onChange={this.updateSearchRoutine} placeholder="Search Exercise"/>
                            <ul>
                                {routineTemplates && routineTemplates.filter(routTemplate => rabinKarp(searchRoutine.toLowerCase(), routTemplate.name.toLowerCase())).map(routineTemplate => (
                                    <li onClick={selectRoutine(routineTemplate)} >{routineTemplate.name}</li>
                                ))}
                            </ul>
                        </form>
                        <div className="modal__cancel-box">
                            <Cancel onClick={closeSelectRoutineModal} className="icon"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SelectRoutine;