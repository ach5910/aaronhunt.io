import React from 'react';
import SelectInput, { SelectItem, SelectListItem } from "../Components/SelectInput";
import InfiniteCalendar from 'react-infinite-calendar';
import moment from 'moment';

const HOURS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const MINUTES = ["00", "15", "30", "45"];

const WorkoutDate = ({date, duration, onSelectDate, onSelectDuration})  => (
    <div className="date-time-container">
        <SelectInput
            label="Date"
            value={date}
            renderValue={(selected) => <SelectItem selected={selected}/>}
            listClass="date-time-calendar-list"
        >
            <InfiniteCalendar
                showToday={false}
                width={window.innerWidth <= 650 ? window.innerWidth - 40 : 400}
                height={280}
                autoFocus={false}
                displayOptions={{showTodayHelper:  false, showHeader: false}}
                theme={{
                    weekdayColor: "#5a5c5e",
                    selectionColor: "#5a5c5e"
                }}
                onSelect={onSelectDate}
                selected={moment(date, "MM/DD/YY").format("YYYY-MM-DD")}
            />
        </SelectInput>
        <SelectInput
            label="Duration"
            value={duration}
            renderValue={(selected) => <SelectItem selected={selected}/>}
            listClass="date-time-duration-list"
            inputUnits="(hrs:mins)"
        >
        {HOURS.map(hour => MINUTES.map(min => (
            <SelectListItem 
                value={`${hour}:${min}`}
                selected={`${hour}:${min}` === duration}
                onChange={onSelectDuration(`${hour}:${min}`)}
            />
            )))
        }
        </SelectInput>
    </div>
)

export default WorkoutDate;
