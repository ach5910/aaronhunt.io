import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';

import Signup from '../ui/Signup';
import Dashboard from '../ui/Dashboard';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/dashboard'];

export default class Routes extends React.Component{
  constructor(props){
    super(props);
  }

  // componentDidMount = () => {
  //   this.onAuthChange(this.props.isAuthenticated);
  // }

  // componentDidUpdate = (prevProps) => {
  //   if (prevProps.isAuthenticated !== this.props.isAuthenticated){
  //     this.onAuthChange(this.props.isAuthenticated);
  //   }
  // }
  
  onEnterPublicPage = () => {
    if (Meteor.userId()) {
      this.props.history.replace('/dashboard');
    }
  };
  
  onEnterPrivatePage = () => {
    if (!Meteor.userId()) {
      this.props.history.replace('/');
    }
  };

  // onAuthChange = (isAuthenticated) => {
  //   const pathname = this.props.history.location.pathname;
  //   const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  //   const isAuthenticatedPage = authenticatedPages.includes(pathname);
  
  //   if (isUnauthenticatedPage && isAuthenticated) {
  //     this.props.history.replace('/dashboard');
  //   } else if (isAuthenticatedPage && !isAuthenticated) {
  //     this.props.history.replace('/');
  //   }
  // };

  render(){
    return (
      <Router history={this.props.history}>
        <Switch >
          <Route path="/" exact component={Login} onEnter={this.onEnterPublicPage}/>
          <Route path="/signup" exact component={Signup} onEnter={this.onEnterPublicPage}/>
          <Route path="/dashboard" exact component={Dashboard} onEnter={this.onEnterPrivatePage}/>
          {/* <Route path="*" component={NotFound}/> */}
        </Switch>
      </Router>
    )
  }
}

