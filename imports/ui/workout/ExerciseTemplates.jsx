import React from 'react';
import ExerciseTemplate from './ExerciseTemplate';
import CreateExerciseTemplate from './CreateExerciseTemplate';
import AddCircle from '@material-ui/icons/AddCircle';
import moment from 'moment';
import {ResponsiveContainer, Brush, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ExerciseTemplates extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            exerciseTemplateModalOpen: false,
            exerciseTemplateToEdit: null,
            selected: undefined
        }
    }
    closeExerciseTemplateModal = () => {
        this.setState({exerciseTemplateModalOpen: false, exerciseTemplateToEdit: null})
    }

    // selecteExerciseTemplate = (exerciseTemplate) => (e) => {
    //     e.preventDefault();
    //     if (exerciseTemplate.exercises.length > 0){
    //         this.setState({
    //             selected: exerciseTemplate,
    //             chartData: exerciseTemplate.exercises
    //                 .map((ex) => ({
    //                     ...ex.exerciseStats,
    //                     endTime: parseInt(ex.endTime)
    //                 }))
    //         });
    //     }
    // }

    editExerciseTemplate = (exerciseTemplateToEdit) => (e) => {
        e.preventDefault();
        this.setState({exerciseTemplateToEdit, exerciseTemplateModalOpen: true})
    }

    openExerciseTemplateModal = (e) => {
        e.preventDefault();
        this.setState({exerciseTemplateModalOpen: true})
    }

    // getLastWorkoutDate = (exercises = []) => {
    //     if (exercises.length === 0) return "N/A";
    //     return moment(exercises[0].startTime, "x").format("MM/DD")
    // }

    render(){
        const {loading, exerciseTemplates} = this.props;
        const {exerciseTemplateModalOpen, exerciseTemplateToEdit, selected, chartData} = this.state;
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
                {/* <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Completed</th>
                            <th>Top 1RM</th>
                            <th>Last</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exerciseTemplates && exerciseTemplates.sort((a,b) => (b.exercises.length - a.exercises.length))
                        .map(exerciseTemplate => (
                            <tr className={selected && exerciseTemplate._id === selected._id ? "selected" : ""}>
                                <td>
                                    <button 
                                        onClick={this.selecteExerciseTemplate(exerciseTemplate)}
                                        className="button button--link-text"
                                    >
                                        {exerciseTemplate.name}
                                    </button>
                                </td>
                                <td>{exerciseTemplate.exercises.length}</td>
                                <td>{exerciseTemplate.topExerciseStats.topORM.toFixed(2)}</td>
                                <td>{this.getLastWorkoutDate(exerciseTemplate.exercises)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}
                {exerciseTemplates && exerciseTemplates.map(exerciseTemplate => (
                    <ExerciseTemplate editExerciseTemplate={this.editExerciseTemplate} exerciseTemplate={exerciseTemplate} />
                    ))
                }
                <form noValidate className="boxed-view__form">
                    <button onClick={this.openExerciseTemplateModal} className="button button--margin-top" >
                        Add Exercise
                    </button>
                </form>
                {/* {selected &&
                    <React.Fragment >
                        <h1 className="workout--h1">{selected.name}</h1>
                        <ResponsiveContainer minWidth="100%" width="100%" aspect={1.77}>
                            <AreaChart data={chartData.reverse()}
                                margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#5a5c5e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#5a5c5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey = 'endTime'
                                    domain = {['dataMin', 'dataMax']}
                                    scale="utc"
                                    name = 'Time'
                                    tickFormatter = {(endTime) => moment(endTime).format('MM/DD')}
                                    type = 'number'
                                />
                                <YAxis 
                                    width={40}
                                    name="1RM"
                                />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Brush dataKey="name" height={30} stroke="#5a5c5e" travellerWidth={15} />
                                <Tooltip 
                                    formatter={(value, name, props) => [(value.toFixed(2)), "1RM"]}
                                    labelFormatter={(label) => moment(label).format('MM/DD')}
                                />
                                <Area type="monotone" dataKey="totalWeight" stroke="#5a5c5e" fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </React.Fragment>
                }*/}
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