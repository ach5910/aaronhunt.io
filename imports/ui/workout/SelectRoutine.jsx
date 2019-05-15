import React from 'react';
import Cancel from '@material-ui/icons/Cancel';
import { rabinKarp } from '../../startup/client/utils';
import { ButtonSecondary } from '../Components/Button';

class SelectRoutine extends React.Component{
    constructor(props){
        super(props)
        this.state = this.initState();
    }

    initState = () => ({
        searchRoutine: "",
        selectedRoutineTemplate: {
            _id: ""
        },
        recordMethod: ""
    })

    updateSearchRoutine = (e) => {
        e.preventDefault();
        this.setState({searchRoutine: e.target.value})
    }

    updateRecordMethod = (recordMethod) => (e) => {
        e.preventDefault();
        this.setState({recordMethod});
    }

    selectRoutine = (selectedRoutineTemplate) => (e) => {
        e.preventDefault();
        this.setState({selectedRoutineTemplate})
    }

    closeModal = (e) => {
        this.props.closeSelectRoutineModal(e)
        setTimeout(() => {this.setState({...this.initState()})}, 300)
    }

    logClick = (e) => {
        e.preventDefault();
        const {target} = e;
        target.style.webkitAnimationName = "button-click";
        target.addEventListener('webkitAnimationEnd', function(e){
            const {target} = e;
            target.style.webkitAnimationName = "";
        }, false)
    }

    render(){
        const {searchRoutine, recordMethod, selectedRoutineTemplate} = this.state;
        const {routineTemplates, closeSelectRoutineModal, selectRoutine, modalOpen} = this.props;
        return (
            <div className={`boxed-view boxed-view--modal ${modalOpen ? "" : "hidden"}`}>
                <div className="page-content page-content--modal" style={{width: "100%"}}>
                    <div className={`boxed-view__box boxed-view--modal-item ${modalOpen ? "" : "hidden"}`}>
                        <div className={`modal__content-container ${recordMethod}`}>
                            <form noValidate className={`boxed-view__grid form-one ${recordMethod}`} style={{zIndex: 8}}>
                                <div className="boxed-view__grid-section">
                                    <h1 className="workout--h1 boxed-view__grid-section">Log</h1>
                                </div>
                                <div className="boxed-view__grid-section">
                                    <h1 className="workout--h1 boxed-view__grid-section">Track</h1>
                                </div>
                                <div className="boxed-view__grid-section">
                                    <p className="workout--paragraph"><strong>Logging</strong> allows you set up a workout before-hand or record a workout after a session.</p>
                                </div>
                                <div className="boxed-view__grid-section">
                                    <p className="workout--paragraph">Record your workout during your session. <strong>Tracking</strong> provides time-base data that Logging does not.</p>
                                </div>
                                <div className="boxed-view__grid-section">
                                    <ButtonSecondary handleClick={this.updateRecordMethod('log')}>
                                        log
                                    </ButtonSecondary>
                                    {/* <button onClick={this.logClick} className="button button--secondary button--wide">
                                        Log
                                    </button> */}
                                </div>
                                <div className="boxed-view__grid-section">
                                    <button onClick={this.updateRecordMethod('track')} className="button button--wide">
                                        Track
                                    </button>
                                </div>
                            </form>
                            <form noValidate className={`boxed-view__form form-two ${recordMethod}`} style={{zIndex: 8}}>
                                <h1 className="workout--h1">Select Routine</h1>
                                <input type="text" value={searchRoutine} onChange={this.updateSearchRoutine} placeholder="Search Routines"/>
                                <ul className="double-column">
                                    {routineTemplates && routineTemplates.filter(routTemplate => rabinKarp(searchRoutine.toLowerCase(), routTemplate.name.toLowerCase())).map(routineTemplate => (
                                        <li  >
                                            <button
                                                className={`button button--secondary button--flat button--wide ${selectedRoutineTemplate._id === routineTemplate._id ? "selected" : ""}`}
                                                onClick={this.selectRoutine(routineTemplate)}
                                            >
                                                {routineTemplate.name}
                                            </button> 
                                        </li>
                                    ))}
                                </ul>
                                <div className="button__container margin-top">
                                    <button disabled={selectedRoutineTemplate._id === ""} onClick={selectRoutine(selectedRoutineTemplate, recordMethod)} className={`button button--wide ${selectedRoutineTemplate._id === "" ? "disabled" : ""}`}>
                                        Start
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="modal__cancel-box">
                            <Cancel onClick={this.closeModal} className="icon"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SelectRoutine;