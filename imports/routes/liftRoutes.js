import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Switch, Router, Route, Redirect } from 'react-router-dom';
import Signup from '../ui/Signup';
import Dashboard from '../ui/workout/WorkoutDashBoard';
import EmbeddedPlayer from '../ui/workout/EmbeddedPlayer';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/dashboard'];

export default class Routes extends React.Component{
  constructor(props){
    super(props);
  }

  onEnterPublicPage = (RouteComponent) => {
    console.log('public page')
    if (Meteor.userId()) {
      console.log('public page logged in')
      return (<Redirect to="/dashboard" />)
    }
    console.log('public page logged not in')
    return <RouteComponent history={this.props.history} />
  };
  
  onEnterPrivatePage = (RouteComponent)  => {
    console.log('private page')
    if (!Meteor.userId()) {
      console.log('private page no logged in')
      return (<Redirect to="/" />)
    }
    console.log('private page logged in')
    return <RouteComponent history={this.props.history} />
  };


  render(){
    return (
      <Router history={this.props.history}>
        <Switch >
          <Route path="/" exact render={() => this.onEnterPublicPage(Login)}/>
          <Route path="/signup" exact render={() => this.onEnterPublicPage(Signup)}/>
          <Route path="/dashboard" exact render={() => this.onEnterPrivatePage(Dashboard)}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
    )
  }
}

