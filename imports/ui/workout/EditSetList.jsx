import React from 'react';
import Picker from '../Components/Picker';
import DeleteForever from '@material-ui/icons/DeleteForever';

class EditSetList extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            deleteStyle: {},
            deletedSetId: -1
        }
        this.listItem = React.createRef();
    }

    componentDidUpdate(prevProps){
        if (!this.props.expand && prevProps.expand){
            this.setState({deleteStyle: {}})
        }
    }

    handleExpandClick = (setId) => {
        if (setId === this.props.selectedSetId) {
            this.props.handleExpand()
        } else {
            this.props.handleClick(setId);
        }
    }

    onDelete = (e) => {
        e.preventDefault();
        console.log('deleteStyle', this.state.deleteStyle);
        if (!this.state.deleteStyle.width){
            const deleteStyle = {width: "500%", transform: "translateX(40%)", justifyContent: "space-evenly"}
            console.log('new style', deleteStyle);
            this.setState({deleteStyle})
            // if (this.listItem && this.listItem.current){
            //     const {width} = this.listItem.current.getBoundingClientRect();
            // }
        } else {
            this.setState({deleteStyle: {}})
        }
    }

    cancelDelete = (e) => {
        e.preventDefault();
        this.setState({deleteStyle: {}})
    }

    submitDelete = (e) => {
        e.preventDefault();
        const {selectedSetId} = this.props;
        this.setState({deletedSetId: selectedSetId, deleteStyle: {}});
        setTimeout(() => {
            this.props.deleteSet(selectedSetId);
        }, 300);
        console.log('Delete');
    }

    render(){
        const {exercise, handleClick = undefined, updateSetByIncrement, addedSetId, selectedSetId, increments, weightIncrementOptions, repIncrementOptions, expand} = this.props;
        const {deleteStyle, deletedSetId} = this.state;
        return (
            <ul ref={this.listItem} className="workout--list" style={{maxHeight: "none"}}>
                {exercise.sets.map(set => (
                    <li key={`exercise-${exercise._id}--set-${set._id}`} className={`exercise--set exercise--set__header exercise--set__list-item 
                        ${selectedSetId === set._id ? "selected" : ""} ${expand ? "expanded" : ""} ${set._id === deletedSetId ? "deleted" : set._id === addedSetId ? "added" : ""}`}
                        onClick={(e) => {if (handleClick !== undefined) handleClick(set._id)}}>
                        <div 
                            onClick={(e) => {e.preventDefault(); e.stopPropagation(); this.handleExpandClick(set._id)}} 
                            className="exercise--title"
                        >
                            <div className="set">{set.setNumber}</div>
                            <div className="arrow"></div>
                        </div>
                        <div
                            onClick={(e) => {if(selectedSetId === set._id) e.stopPropagation();}}
                            className='exercise--weight'
                        >
                            <div 
                                onClick={updateSetByIncrement(set._id, "weight", set.weight + increments.weight)}
                                className="exercise--inc-btn"
                            >+</div>
                            <Picker value={set.weight} decimal/>
                            <div 
                                onClick={updateSetByIncrement(set._id, "weight", set.weight - increments.weight)}
                                className="exercise--dec-btn"
                            >-</div>
                        </div>
                        <div 
                            onClick={(e) => {if(selectedSetId === set._id) e.stopPropagation();}} 
                            className="exercise--reps"
                        >
                            <div 
                                onClick={updateSetByIncrement(set._id, "reps", set.reps + increments.reps)}
                                className="exercise--inc-btn"
                            >+</div>
                            <Picker value={set.reps} />
                            <div 
                                onClick={updateSetByIncrement(set._id, "reps", set.reps - increments.reps)}
                                className="exercise--dec-btn"
                            >-</div>
                        </div>
                        <div className="exercise--orm">
                            <Picker value={(set.weight * (1 + (set.reps / 30))).toFixed(2)} decimal/>
                        </div>
                        {selectedSetId === set._id &&
                            <React.Fragment >
                                {/* <div className="exercise--collapse-arrow" onClick={(e) => {e.preventDefault(); e.stopPropagation(); this.handleExpandClick(set._id)}}></div> */}
                                <div className="exercise--weight-inc"  
                                    onClick={(e) => {e.preventDefault(); e.stopPropagation()} }
                                >{weightIncrementOptions}</div>
                                <div className="exercise--reps-inc"
                                    onClick={(e) => {e.preventDefault(); e.stopPropagation()} }
                                >{repIncrementOptions}</div>
                                <div className="exercise--delete-set">
                                    <div className={`exercise--delete-set-wrapper ${deleteStyle.width ? 'delete-open' : ''}`}>
                                        <DeleteForever onClick={this.onDelete} style={{width: "2.6rem", height: "2.6rem", marginLeft: "0px"}}  className="icon"/>
                                        {/* {deleteStyle.width && */}
                                            <React.Fragment>
                                                {/* <p className="workout--paragraph delete-text">Delete Set?</p> */}
                                                <button onClick={this.cancelDelete} className={`button button--secondary button--margin delete-set--button ${deleteStyle.width ? "visible" : ""}`}>Cancel</button>
                                                <button onClick={this.submitDelete} className={`button button--margin delete-set--button ${deleteStyle.width ? "visible" : ""}`}>Delete Set</button>
                                            </React.Fragment>

                                        {/* } */}
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </li>
                ))}
            </ul>
        )
    }
}

export default EditSetList;