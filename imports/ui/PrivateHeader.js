import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import {
  CREATE_QUESTION_PAGE,
  LIST_QUESTION_PAGE,
  TEST_PAGE
} from '../startup/client/constants';

const PrivateHeader = (props) => {
  return (
    <div className="header">
      <div className="header__content">
        <h1 className="workout--h1 header__title">{props.title}</h1>
        <div className="header__links">
          <button 
            className="button button--link-text" 
            onClick={() => {props.onPageChange(TEST_PAGE)}}
            style={{marginRight: "10px"}}
          >
            Test
          </button>
          <button 
            className="button button--link-text" 
            onClick={() => {props.onPageChange(CREATE_QUESTION_PAGE)}}
            style={{marginRight: "10px"}}
          >
            Create
          </button>
          <button 
            className="button button--link-text" 
            onClick={() => {props.onPageChange(LIST_QUESTION_PAGE)}}
            style={{marginRight: "10px"}}
          >
            List
          </button>
          <button className="button button--link-text" onClick={() => {
            Accounts.logout();
            props.history.replace('/')
            }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default PrivateHeader;
