import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Step from './Step';
import { getTransitionEvent } from '../../../startup/client/utils';
import { AUTO, MAX } from '../TargetDuration';
import moment from 'moment';
import ProjectFormHeader from '../ProjectFormHeader';
import Panel from '../Panel';

const step = {
    stepId: "",
    options: [],
    value: null,
    message: "",
    hints: null,
    getFormProps: function(props){
        return props
    },
    renderLabel: function(){
        return `${this.stepId}: ${this.value ? this.value : ""}`;
    },
    getHint: function(){
        return this.hints ? this.hints[this.value] : ""
    }
}

const node = {
    step: null,
    parent: null,
    children: null,
}

Object.defineProperty(node, "next", {
    get(){
        if (this.children){
            if (this.children.default){
                return this.children.default
            } else if (this.step && this.step.value){
                return this.children[this.step.value]
            }
        }
        return this.children;
    }
})

/**
 * 
 * Step objects
 * 
 */

/**
 * type step
 */
const type = Object.create(step);
type.stepId = "type";
type.message = "Choose which type of Reels you would like to receive. and "
type.hints = {"Clips": "Clips encapsulate single plays ", "Highlights": "Highlights are a compilation of Clips"}
type.options = [
    {id: "Clips"},
    {id: "Highlights",}
]
type.value = "Clips";

/**
 * Clips per step
 */
const clipsPer = Object.create(step);
clipsPer.stepId = "per";
clipsPer.hints = {
    "Events": "Event clips are not filter by a team or player(s)",
    "Teams": "Team clips always include the selected team",
    "Players": "Plater clips always include the selected player(s). Multiple players must be on the same team"
}
clipsPer.options = [
    {id: "Events"},
    {id: "Teams"},
    {id: "Players"},
];
clipsPer.value = "Events";
clipsPer.message = "Choose which type of clips you would like to receive."

/**
 * Highlights per step
 */
const highlightsPer = Object.create(step);
highlightsPer.stepId = "per";
highlightsPer.value = "Events";
highlightsPer.message = "Choose which type of highights you would like to receive.";
highlightsPer.hints = {
    "Events": "Event highlights are not filter by a team, play type or player(s).",
    "Teams": "A highlight made up entirely of the selected team.",
    "Players": "A highlight made up entirely of the selected player(s). Multiple players must be on the same team.",
    "PlayType": "A highlight made up entirely of the selected play type."
}
highlightsPer.options = [
    {id: "Events"},
    {id: "Teams"},
    {id: "Players"},
    {id: "PlayType"},
]

/**
 * Excitement step
 */
const excitement = Object.create(step);
excitement.stepId = "excitement";
excitement.message = "Excitement thresholds filter out all other clips that fall below it's value."

/**
 * Period coverage step
 */
const period = Object.create(step);
period.stepId = "period";
period.value = ["End"];
period.message = "A Period highlight focuses on specific times of the event."
period.hints = {
    1: "Create a highlight from just the selected period",
    2: "Create a highlight from the range of two inclusive periods",
    "End": "Create a higlight that spans the entire event"
}
period.getHint = function getPeriodHint(){
    return this.value == "End" ? this.hints.End : this.hints[this.value.length]
}
period.getFormProps = function getPeriodFormProps({maxPeriods}){
    return {maxPeriods}
}
period.renderLabel = function renderPeriodLabel(){
    if (this.value.length == 1){
        return `${this.stepId}: ${this.value[0]}`;
    }
    const min = Math.min(...this.value);
    const max = Math.max(...this.value);
    return `${this.stepId}: ${min}-${max}`
}

/**
 * Play Type step
 */
const playTypes = Object.create(step);
playTypes.stepId = "playTypes";
playTypes.message = "Select the play type(s) you would like receive.";
playTypes.getFormProps = function getPlayTypeFormProps({playTypes}){
    return {playTypes}
}
playTypes.renderLabel = function renderPlayTypeLabel(){
    return `${this.stepId}: ${this.value ? this.value.title : ""}`
}

/**
 * Focus step
 */
const focus = Object.create(step);
focus.stepId = "focus";
focus.value = "Team";
focus.message = "Focus creates a highlights that is biased to your selected team or player(s)" 
focus.hints = {
    "Team": "Highlights that are created will favor the selected team",
    "Player": "Highlights that are created will favor the selected player(s)"
}
focus.options =[
    {id: "Team"},
    {id: "Player"},
]

/**
 * Target Duration step
 */
const duration = Object.create(step);
duration.stepId = "duration";
duration.value = AUTO;
duration.message = "Target duration sets the requested length of the highlight given the selected options."
duration.hints = {
    "default":"A time duration highlight is created using the most important plays to reach the requested length",
    [AUTO]: "An auto duration highlight selects the best plays and duration based on optimal output logic.",
    [MAX]: "An event max duration highlight returns a full condensed game. Any other max highlight covers all required plays regardless of length."//"A max duration highlight contains of all the plays in the event. This produces a shortened version of the game"
}
duration.getHint = function getDurationHint(){
    return [AUTO, MAX].includes(this.value) ? this.hints[this.value] : this.hints.default
}
duration.renderLabel = function renderDurationLable(){
    const dur =  [AUTO, MAX].includes(this.value) ? this.value : moment.utc(this.value * 1000).format("m:ss");
    return `${this.stepId}:\u00A0${dur}`
}

/**
 * Team select step
 */
const team = Object.create(step);
team.stepId = "team";
team.message = "Select a team for the highlight"
team.getFormProps = function getTeamFormProps({allTeams, teamOptions}){
    return {allTeams, teamOptions}
}

/**
 * Player select step
 */
const player = Object.create(step);
player.stepId = "player";
player.message = "Select a player for the highlight"

/**
 * Play Types filters step
 */
const filter = Object.create(step);
filter.stepId = "filter";
filter.value = "Team";
filter.message = "Filters clips included in the highlight to be a combination with the play type."
filter.hints = {
    "Team": "Clips with the selected team and play type are used to create a highlight",
    "Player": "Clips with the selected player(s) and play type are used to create a highlight"
}
filter.options = [
    {id: "Team"},
    {id: "Player"},
]

/**
 * 
 * Node objects
 * 
 * 
 */
const playTypesNode = Object.create(node);
const playTypesHNode = Object.create(node);
const durationNode = Object.create(node);
const periodNode = Object.create(node);
const periodClipNode = Object.create(node);
const excitementNode = Object.create(node);
const playerNode = Object.create(node);
const playerClipNode = Object.create(node);
const teamNode = Object.create(node)
const filterTeamNode = Object.create(node);
const teamClipNode = Object.create(node);
const focusNode = Object.create(node);
const filterNode = Object.create(node);
const clipsNode = Object.create(node);
const highlightsNode = Object.create(node);
const typeNode = Object.create(node);


playTypesNode.step = playTypes;
playTypesNode.parent = periodNode;

playTypesHNode.step = playTypes;
playTypesHNode.parent = highlightsNode;
playTypesHNode.children = {"default": filterNode}

durationNode.step = duration;
durationNode.parent = clipsNode;

periodNode.step = period;
periodNode.parent = excitementNode;
periodNode.children = {"default": durationNode}

periodClipNode.step = period;
periodClipNode.parent = excitementNode;
periodClipNode.children = {"default": playTypesNode}

excitementNode.step = excitement;
excitementNode.parent = clipsNode;
excitementNode.children = {"default": periodClipNode}

playerNode.step = player;
playerNode.children = {"default": periodNode};

playerClipNode.step = player;
playerClipNode.parent = clipsNode;
playerClipNode.children = {"default": excitementNode}

teamNode.step = team;
teamNode.parent = highlightsNode;
teamNode.children = {"default": playerNode}

filterTeamNode.step = team;
filterTeamNode.children = {"default": periodNode}

teamClipNode.step = team;
teamClipNode.parent = clipsNode;
teamClipNode.children = {"default": excitementNode}

focusNode.step = focus;
focusNode.parent = highlightsNode;
focusNode.children = {"Team": filterTeamNode, "Player": playerNode}

filterNode.step = filter;
filterNode.parent = playTypesHNode;
filterNode.children = {"Team": filterTeamNode, "Player": playerNode}

clipsNode.step = clipsPer;
clipsNode.parent = typeNode;
clipsNode.children = {"Events": excitementNode, "Teams": teamClipNode, "Players": playerClipNode}

highlightsNode.step = highlightsPer;
highlightsNode.parent = typeNode;
highlightsNode.children = {
    "Events": focusNode,
    "Teams": teamNode,
    "Players": playerNode,
    "PlayType": playTypesHNode,
}

typeNode.step = type;
typeNode.children = {"Clips": clipsNode, "Highlights": highlightsNode}

/**
 * @module
 * Stepper Map object handles updating the stepper data structure and dispatching
 * it's changes
 */
const stepperMap = (function(){
    var listeners = [];
    var head;
    var curr;

    var publicAPI = {
        loadStepper,
        attach,
        detach,
        formatCurrentStep,
        setValue,
        selectOption,
        selectStep,
        getNextStep,
        getPrevStep,
        getHead,
    };

    return publicAPI;

    /**
     * Loads a stepper map by accepting the head node
     * 
     * @param {node} _head
     *  
     */
    function loadStepper(_head){
        head = _head;
        curr = head;
    }

    function getHead(){
        return head;
    }

    /**
     * Adds a function callback to the listeners array
     * @param {function} fn 
     */
    function attach(fn){
        listeners.push(fn)
    }

    /**
     * Removes a function callback from the listeners array
     * @param {function} fn 
     */
    function detach(fn){
        listeners = listeners.filter(_fn => _fn !== fn)
    }

    /**
     * Formats a current step object
     * 
     * @return current step obj
     */
    function formatCurrentStep(){
        return {
            prevStep: !!curr.parent,
            nextStep: !!curr.children,
            value: curr.step.value,
            options: curr.step.options,
            stepId: curr.step.stepId,
            getFormProps: curr.step.getFormProps,
            renderLabel: curr.step.renderLabel,
            message: curr.step.message,
            getHint: curr.step.getHint,
            hints: curr.step.hints
        }
    }

    /**
     * Iterate over the listeners and invoke the functions with the formatted current step
     * 
     */
    function dispatch(){
        const _currStep = formatCurrentStep()
        listeners.forEach(fn => {
            fn(_currStep);
        })
    }

    function setValue(val){
        curr.step.value = val;
        dispatch()
    }

    function selectOption(id){
        curr.step.value = id;
        dispatch()
    }

    function selectStep(stepId){
        let _curr = head
        let _prev = null;
        while(_curr.step.stepId != stepId && curr.children){
            _prev = _curr;
            _curr = _curr.next;
            _curr.parent = _prev;
        }
        curr = _curr;
        dispatch()
    }

    function getPrevStep(){
        curr = curr.parent;
        dispatch()
    }

    function getNextStep(){
        const _prev = curr;
        curr = _prev.next;
        curr.parent = _prev;
        dispatch()
    }
})()

/**
 * @module
 * Stepp UI handles events fired on the Stepper component, updates the DOM and invokes updates
 * on the Stepper Map obj
 */
const stepperUI = (function(){
    var currRef = null;
    var selectedStepId = null;

    function updateRef(ref){
        if (ref){
            currRef = ref;
            toggleCurrent()
        }
    }

    function handleOptions(id){
        stepperMap.selectOption(id)
    }

    handleValue = (val) => () => {
        stepperMap.setValue(val)
    }

    function handlePrev(){
        toggleCurrent(updatePrev)
    }

    function updatePrev(){
        removeTransitionListener(updatePrev);
        stepperMap.getPrevStep();
    }

    /**
     * Toggles the current class on the current ref and updates the 
     * height if current class was added
     * 
     * @param {function} fn callback from transitionend event
     */
    function toggleCurrent(fn){
        const func = fn || this.removeTransitionListener;
        currRef.addEventListener(getTransitionEvent(currRef), func)
        setTimeout(() => {
            currRef.classList.toggle("current");
            if (currRef.style.height){
                currRef.style.height = ""
            } else {
                let height = 80;
                for(let i = 0; i < currRef.children.length; i++){
                    const child = currRef.children[i];
                    if (/(step__form|button-container)/.test(child.className)){
                        height += child.clientHeight;
                    }
                }
                currRef.style.height = height + "px";
            }
        })
    }

    function handleNext(){
        toggleCurrent(updateNext)
    }

    onSelect = (stepId) => () => {
        selectedStepId = stepId;
        toggleCurrent(updateSelect)
    }

    function updateSelect(){
        removeTransitionListener(updateSelect)
        stepperMap.selectStep(selectedStepId)
    }

    function removeTransitionListener(fn){
        const func = fn || removeTransitionListener;
        currRef.removeEventListener(getTransitionEvent(currRef), func)
    }

    function updateNext(){
        removeTransitionListener(updateNext)
        stepperMap.getNextStep();
    }

    const publicAPI = {
        updateRef,
        handleOptions,
        handleValue,
        handlePrev,
        handleNext,
        onSelect
    }

    return publicAPI;
})();

stepperMap.loadStepper(typeNode);

function renderStep(key, step, formProps, handlers){
    const props = {key, step, formProps, ...handlers}
    return (
        <Step {...props}/>
    )
}

function renderSteps(currStep, props){
    const stepComps = [];
    const {onSelect, ...uiHandlers} = stepperUI;
    let curr = stepperMap.getHead();
    while(curr){
        if (curr.step.stepId === currStep.stepId){
            stepComps.push(renderStep(currStep.stepId, currStep, currStep.getFormProps(props), uiHandlers))
        } else {
            stepComps.push(renderStep(curr.step.stepId, curr.step, curr.step.getFormProps(props), {onSelect}))
        }
        curr = curr.next;
    }
    return stepComps
}

const Stepper = (props) => {
    const [currStep, setCurrStep] = useState(stepperMap.formatCurrentStep());
    function updateCurrStep(_currStep){
        setCurrStep(_currStep);
    }
    useEffect(() => {
        stepperMap.attach(updateCurrStep)
        return () => {
            stepperMap.detach(updateCurrStep)
        }
    }, [currStep])

    return (
        <div>
            <ProjectFormHeader
                title={"Stepper"}
                handleClick={() => {}}
            />
            <Panel
                description="Configure your automated highlights."
                action="These highlights will be available to your publish destination as the event happens"
            >
                {renderSteps(currStep, props)}
            </Panel>
        </div>
    )
}

Stepper.defaultProps = {

}

Stepper.propTypes = {

}

export default Stepper;

// const hlr = {
//     stepId: "type",
//     options: [
//         {
//             id: "Clips",
//             nextStep: 
//             {
//                 stepId:"per",
//                 options: 
//                 [
//                     {
//                         id: "Events",
//                     },
//                     {
//                         id: "Teams",
//                     },
//                     {
//                         id: "Players",
//                     },
                
//                 ],
//                 // value: null,
//                 // defaultValue: "Events",
//                 value: "Events",
//                 nextStep: 
//                 {
//                     stepId: "excitement",
//                     options: null,
//                     value: null,
//                     // defaultValue: null,
//                     prevStep: null,
//                     nextStep: 
//                     {
//                         stepId: "period",
//                         options: null,
//                         value: null,
//                         // defaultValue: null,
//                         prevStep: null,
//                         nextStep: 
//                         {
//                             stepId: "playTypes",
//                             options: null,
//                             value: null,
//                             prevStep: null,
//                             // defaultValue: null,
//                         }
//                     }
//                 },
//                 prevStep: null,
//             }
//         },
//         {
//             id: "Highlights",
//             nextStep: 
//             {
//                 stepId: "per",
//                 options:
//                 [
//                     {
//                         id: "Event",
//                         nextStep:
//                         {
//                             stepId: "focus",
//                             options: 
//                             [
//                                 {
//                                     id: "Team",
//                                 },
//                                 {
//                                     id: "Player",
//                                 }
//                             ],
//                             // value: null,
//                             // defaultValue: "Team",
//                             value: "Team",
//                             nextStep:
//                             {
//                                 stepId: "period",
//                                 options: null,
//                                 value: null,
//                                 // defaultValue: null,
//                                 prevStep: null,
//                                 nextStep: 
//                                 {
//                                     stepId: "duration",
//                                     options: null,
//                                     value: null,
//                                     prevStep: null,
//                                     // defaultValue: null,
//                                 }
//                             },
//                             prevStep: null
//                         }
//                     },
//                     {
//                         id: "Team",
//                         nextStep: 
//                         {
//                             stepId: "team",
//                             options: null,
//                             value: null,
//                             prevStep: null,
//                             // defaultValue: null,
//                             nextStep:
//                             {
//                                 stepId: "player",
//                                 options: null,
//                                 value: null,
//                                 prevStep: null,
//                                 // defaultValue: null,
//                                 nextStep:
//                                 {
//                                     stepId: "period",
//                                     options: null,
//                                     value: null,
//                                     // defaultValue: null,
//                                     prevStep: null,
//                                     nextStep: 
//                                     {
//                                         stepId: "duration",
//                                         options: null,
//                                         value: null,
//                                         prevStep: null,
//                                         // defaultValue: null,
//                                     }
//                                 },
//                             }
//                         }
//                     },
//                     {
//                         id: "Player",
//                         nextStep:
//                         {
//                             stepId: "player",
//                             options: null,
//                             value: null,
//                             prevStep: null,
//                             // defaultValue: null,
//                             nextStep:
//                             {
//                                 stepId: "period",
//                                 options: null,
//                                 value: null,
//                                 defaultValue: null,
//                                 prevStep: null,
//                                 nextStep: 
//                                 {
//                                     stepId: "duration",
//                                     options: null,
//                                     value: null,
//                                     prevStep: null,
//                                     // defaultValue: null,
//                                 }
//                             },
//                         }
//                     },
//                     {
//                         id: "PlayType",
//                         nextStep: 
//                         {
//                             stepId: "playTypes",
//                             options: null,
//                             value: null,
//                             prevStep: null,
//                             // defaultValue: null,
//                             nextStep: 
//                             {
//                                 stepId: "filter",
//                                 options: 
//                                 [
//                                     {
//                                         id: "Team",
//                                         nextStep:
//                                         {
//                                             stepId: "team",
//                                             options: null,
//                                             value: null,
//                                             prevStep: null,
//                                             // defaultValue: null,
//                                             nextStep:
//                                             {
//                                                 stepId: "period",
//                                                 options: null,
//                                                 value: null,
//                                                 // defaultValue: null,
//                                                 prevStep: null,
//                                                 nextStep: 
//                                                 {
//                                                     stepId: "duration",
//                                                     options: null,
//                                                     value: null,
//                                                     prevStep: null,
//                                                     // defaultValue: null,
//                                                 }
//                                             },
                                            
//                                         }
//                                     },
//                                     {
//                                         id: "Player",
//                                         nextStep:
//                                         {
//                                             stepId: "player",
//                                             options: null,
//                                             value: null,
//                                             prevStep: null,
//                                             // defaultValue: null,
//                                             nextStep:
//                                             {
//                                                 stepId: "period",
//                                                 options: null,
//                                                 value: null,
//                                                 // defaultValue: null,
//                                                 prevStep: null,
//                                                 nextStep: 
//                                                 {
//                                                     stepId: "duration",
//                                                     options: null,
//                                                     value: null,
//                                                     prevStep: null,
//                                                     // defaultValue: null,
//                                                 }
//                                             },
//                                         }
//                                     }
//                                 ],
//                                 // value: null,
//                                 // prevStep: null,
//                                 // defaultValue: "Team",
//                                 value: "Team",
//                                 nextStep: this.options[0].nextStep,
//                                 prevStep: null,
//                             }
//                         }
//                     }
//                 ],
//                 // value: null,
//                 // defaultValue: "Event",
//                 // nextStep: null,
//                 value: "Events",
//                 nextStep: this.options[0].nextStep,
//                 prevStep: null
//             }

//         }
//     ],
//     // value: null,
//     // defaultValue: "Clips",
//     value: "Clips",
//     nextStep: this.options[0].nextStep,
//     // nextStep: null
// }