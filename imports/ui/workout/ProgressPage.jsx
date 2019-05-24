import React from 'react';
import moment from 'moment';
import {ResponsiveContainer, Brush, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import SelectInput, { SelectItem, SelectListItem } from '../Components/SelectInput';

const PROGRESS_STATS = [
    "One Rep Max",
    "Total Weight"
]
export default class ProgressPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selected: undefined,
            chartData: undefined,
            progressStat: PROGRESS_STATS[0]
        }
       // if (!props.loading) this.selectExerciseTemplate(props.exerciseTemplates[0])()
    }

    componentDidMount = () => {
        if (!this.props.loading){
            this.selectExerciseTemplate(this.props.exerciseTemplates[0])();
        }
    }

    // componentDidUpdate = () => {
    //     if (!this.props.loading && this.state.selected === undefined){
    //         this.selectExerciseTemplate(this.props.exerciseTemplates[0])();
    //     }
    // }
    selectExerciseTemplate = (exerciseTemplate) => (e) => {
        if (e) e.preventDefault();
        if (exerciseTemplate.exercises.length > 0){
            this.setState({
                selected: exerciseTemplate,
                chartData: exerciseTemplate.exercises
                    .map((ex) => ({
                        ...ex.exerciseStats,
                        endTime: parseInt(ex.endTime)
                    }))
            });
        }
    }

    selectProgressState = (progressStat) => (e) => {
        e.preventDefault();
        this.setState({progressStat});
    }

    render(){
        const {selected, chartData, progressStat} = this.state;
        const {exerciseTemplates = []} = this.props;
        return(
            <React.Fragment>
                    <h1 className="workout--h1">Exercise Progress</h1>
                    <hr/>
                    <div className="select-container">
                        <SelectInput
                            label="Exercise"
                            placeholder="Select Exercise"
                            className="exercise-container"
                            value={selected || ""}
                            renderValue={(exerciseTemplate) => <SelectItem className="single-line-text" selected={exerciseTemplate && exerciseTemplate.name}/>}
                        >
                            {exerciseTemplates.filter(exTemp => exTemp.exercises.length > 1).map((exerciseTemplate) => (
                                <SelectListItem 
                                    selected={selected && selected._id === exerciseTemplate._id}
                                    value={exerciseTemplate.name}
                                    onChange={this.selectExerciseTemplate(exerciseTemplate)}
                                />
                            ))
                            }
                        </SelectInput>
                        <SelectInput
                            className="progress-container"
                            label="Progress Stat"
                            placeholder="Select Progress Stat"
                            value={progressStat}
                            renderValue={(stat) => <SelectItem selected={stat}/>}
                        >
                            {PROGRESS_STATS.map((stat) => (
                                <SelectListItem 
                                    selected={stat === progressStat}
                                    value={stat}
                                    onChange={this.selectProgressState(stat)}
                                />
                            ))
                            }
                        </SelectInput>
                    </div>
                {selected &&
                    <React.Fragment >
                        <ResponsiveContainer minWidth="100%" width="100%" aspect={1}>
                            <AreaChart data={[...chartData].reverse()}
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
                                    //label={{value:"Date", position: "bottom", offset: 20}}
                                />
                                <YAxis 
                                    width={40}
                                    //label={{value: progressStat === PROGRESS_STATS[0] ? "1RM" : "Total Weight", angle: -90, position: "insideLeft"}}
                                    name={progressStat === PROGRESS_STATS[0] ? "1RM" : "Total Weight"}
                                />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Brush dataKey="name" height={50} stroke="#5a5c5e" travellerWidth={20} />
                                <Tooltip 
                                    formatter={(value, name, props) => [(value.toFixed(2)), progressStat === PROGRESS_STATS[0] ? "1RM" : "Total Weight"]}
                                    labelFormatter={(label) => moment(label).format('MM/DD')}
                                />
                                <Area type="monotone" dataKey={progressStat === PROGRESS_STATS[0] ? "topORM" : "totalWeight"} stroke="#5a5c5e" fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}