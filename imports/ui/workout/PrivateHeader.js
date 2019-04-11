import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  WORKOUT_PAGE,
  ROUTINES_PAGE,
  EXERCISES_PAGE
} from '../../startup/client/constants';

const PrivateHeader = (props) => {
  return (
    <div className="header">
      <div className="header__content">
        <h1 className="workout--h1 header__title">{props.title}</h1>
        <div className="header__links">
          <button 
            className="button button--link-text" 
            onClick={() => {props.onPageChange(WORKOUT_PAGE)}}
            style={{marginRight: "10px"}}
          >
            Workout
          </button>
          <button 
            className="button button--link-text" 
            onClick={() => {props.onPageChange(ROUTINES_PAGE)}}
            style={{marginRight: "10px"}}
          >
            Routines
          </button>
          <button 
            className="button button--link-text" 
            onClick={() => {props.onPageChange(EXERCISES_PAGE)}}
            style={{marginRight: "10px"}}
          >
            Exercise
          </button>
          <button className="button button--link-text" onClick={() => {
            Meteor.logout(() => {props.history.replace('/')});
            }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default PrivateHeader;
