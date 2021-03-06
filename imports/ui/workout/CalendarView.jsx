import React from 'react';
import InfiniteCalendar, { Calendar, withMultipleDates, defaultMultipleDateInterpolation} from 'react-infinite-calendar';
import Routines from './Routines';
import moment from 'moment';

const CalendarView = ({routineDates, routinesForDay, onSelect, today, viewWorkout}) => (
    <div style={{paddingBottom: "30px"}}>
        <div className="calendar-view">
            <InfiniteCalendar
                Component={withMultipleDates(Calendar)}
                // interpolateSelection={this.handleSelectedDate}
                showToday={routineDates.length === 0}
                min={moment(routineDates[routineDates.length - 1], "YYYY-MM-DD").startOf('month')}
                max={moment(today).endOf('month')}
                width={window.innerWidth <= 650 ? window.innerWidth - 40 : 400}
                height={280}
                autoFocus={false}
                displayOptions={{showTodayHelper:  false, showHeader: false}}
                theme={{
                    weekdayColor: "#5a5c5e",
                    // weekdayColor: "#cad1db",
                    selectionColor: date => {
                        // console.log(date, routineDates[0])
                        // const dateMs = moment(date).valueOf();
                        return date === routineDates[0]
                            ? "#5a5c5e"
                            : routineDates.includes(date)
                            ? "#838b91"
                            : "#FFFFFF"
                    }
                }}
                onSelect={onSelect}
                selected={routineDates}
            />
        </div>
        {routinesForDay.length > 0 
            ? <Routines viewWorkout={viewWorkout} routines={routinesForDay} />
            : <h2>No Workouts for this day</h2>
            
                // <form noValidate className="boxed-view__form">
                //     <button onClick={this.openSelectRoutineModal} className="button">Start new Workout</button>
                // </form>
            
            

        }
    </div>
)

export default CalendarView;