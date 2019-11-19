import React from 'react';
import PropTypes from 'prop-types';
import RadioButtons from '../RadioButtons';
import { ButtonSecondary, ButtonPrimary } from '../Button';
import SelectInput, {SelectItem, SelectListItem} from "../SelectInput";
import PeriodCoverage from '../PeriodCoverage';
import TargetDuration from '../TargetDuration';
const names = ["Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie", "Aaron", "Ben", "David", "Jonathan", "Tim", "Jack", "Trevory", "Jamie"];
const StepRadio = ({stepId, value, options, handleOptions}) => (
    <RadioButtons 
        label={stepId}
        checked={value} 
        radioOptions={options} 
        onChange={handleOptions} 
    />
)

const StepSelect = ({stepId, value, options, handleValue}) => (
    <SelectInput
        label={stepId}
        value={value}
        fixedList
        renderValue={(value) => (<SelectItem selected={value}/>)}
    >
        {options.map(option => (
            <SelectListItem
                value={option}
                selected={option == value}
                onChange={handleValue(option)}
            />
        ))

        }
    </SelectInput>
)

const StepPlayType = ({stepId, value, handleValue, playTypes}) => (
    <SelectInput
        label={stepId}
        value={value}
        fixedList
        renderValue={(value) => (<SelectItem selected={(value && value.title || "")}/>)}
    >
        {playTypes.map(option => (
            <SelectListItem
                value={option.title}
                selected={option.id == (value && value.id || "")}
                onChange={handleValue({id: option.id, title: option.title})}
            />
        ))

        }
    </SelectInput>
)

const StepDuration = ({value, handleValue}) => {

    handleChange = (val) => {
        handleValue(val)()
    }

    return (
        <TargetDuration maxValue={905} onChange={handleChange} duration={value} />
    )
}
const StepTeamMenu = ({stepId, value, teamOptions, allTeams, handleValue}) => (
    <SelectInput
        label={stepId}
        value={value}
        fixedList
        renderValue={(value) => (<SelectItem selected={value}/>)}
    >
        {teamOptions.map(option => (
            <SelectListItem
                value={option.name}
                selected={option.name == value}
                onChange={handleValue(option.name)}
            />
        ))

        }
    </SelectInput>
)

const StepPeriod = ({stepId, value, maxPeriods, handleValue}) => {

    handleChange = (per) => () => {
        if (per == "End" || value[0] == "End"){
            handleValue([per])()
        } else if (value.includes(per)){
            if (value.length == 2){
                handleValue(value.filter(n => n !== per))()
            }
        } else {
            handleValue([per, value[0]])()
        }
    }
    return (
        <PeriodCoverage 
            label={stepId}
            periods={value}
            numberOfPeriods={maxPeriods}
            onChange={handleChange}
            cumulative={value.length == 2}
        />
    )
}

const forms = {
    "type": StepRadio,
    "per": StepRadio,
    excitement: StepSelect,
    period: StepPeriod,
    playTypes: StepPlayType,
    focus: StepRadio,
    duration: StepDuration,
    team: StepTeamMenu,
    player: StepSelect,
    filter: StepRadio,
}
function noop(){};
function Step(props){
    const {step: {stepId, value, options, prevStep, nextStep}, updateRef, handleOptions, handleValue, formProps} = props;
    const FormComp = forms[stepId];
    const defaultFormProps = {stepId, value, handleOptions, handleValue, options: options.length ? options : names}
    const hint = props.step.getHint();
    return(
        <div ref={updateRef} className={`step`}>
            <div className="step__line"/>
            <div className="step__ball" onClick={props.onSelect(stepId)}/>
            <span className="step__summary">{props.step.renderLabel()}</span>
            <div className="step__message">{props.step.message}</div>
            
                <div className="step__form">
                    {hint !== "" &&
                        <div className="step__hint">{hint}</div>
                    }
                    <FormComp {...{...defaultFormProps, ...formProps}}/>
                </div>
                <div className="button-container button-container--bottom" style={{paddingTop: "40px"}}>
                    <ButtonSecondary handleClick={props.handlePrev} disabled={!prevStep}>
                        Prev
                    </ButtonSecondary>
                    <ButtonPrimary handleClick={props.handleNext} disabled={!nextStep}>
                        Next
                    </ButtonPrimary>
                </div>
        </div>
    )
}

Step.defaultProps = {
    handleNext: noop,
    handleOptions: noop,
    handlePrev: noop,
    onSelect: noop,
    updateRef: noop,
    handleValue: noop
}

Step.propTypes = {
    handleNext: PropTypes.func,
    handleOptions: PropTypes.func,
    handlePrev: PropTypes.func,
    onSelect: PropTypes.func,
    updateRef: PropTypes.func,
    handleValue: PropTypes.func
}

export default Step