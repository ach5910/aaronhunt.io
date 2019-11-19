import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import Signup from '../ui/Signup';
// import Dashboard from '../ui/workout/WorkoutDashBoard';
import EmbeddedPlayer from '../ui/workout/EmbeddedPlayer';
import FullPlayer from '../ui/workout/FullPlayer';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';
import DemoExample from '../ui/workout/DemoExample';

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/dashboard'];

export default class Routes extends React.Component{
  constructor(props){
    super(props);
    state = {
      domain: "http://localhost"
    }
  }

  // componentDidMount = () => {
  //   this.onAuthChange(this.props.isAuthenticated);
  // }

  // componentDidUpdate = (prevProps) => {
  //   if (prevProps.isAuthenticated !== this.props.isAuthenticated){
  //     this.onAuthChange(this.props.isAuthenticated);
  //   }
  // }

  updateDomain = (domain) => this.setState({domain})
  
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
    // if (Meteor.userId() != "T2B4hnfHKARehAyWA" && Meteor.userId() != "3SAGFCw7tMrGkkkbh") return <div>Error</div>;
    return (
      <Router history={this.props.history}>
        <Switch >
          <Route path="/" exact component={Login} onEnter={this.onEnterPublicPage}/>
          <Route path="/signup" exact component={Signup} onEnter={this.onEnterPublicPage}/>
          <Route path="/inline" exact component={EmbeddedPlayer} onEnter={this.onEnterPrivatePage}/>
          <Route path="/demo" exact component={DemoExample} onEnter={this.onEnterPrivatePage}/>
          <Route path="/full" exact component={FullPlayer} onEnter={this.onEnterPrivatePage} />
          {/* <Route path="*" component={NotFound}/> */}
        </Switch>
      </Router>
    )
  }
}

