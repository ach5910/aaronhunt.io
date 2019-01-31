import React from 'react';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }
  onSubmit(e) {
    e.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    if (password.length < 9) {
      return this.setState({error: 'Password must be more than 8 characters long'});
    }

    Accounts.createUser({email, password}, (err) => {
      console.log('Create User')
      if (err) {
        console.log('create user error')
        this.setState({error: err.reason});
      } else {
        Meteor.loginWithPassword({email}, password, (err) => {
          console.log('Meteor Login')
          if (err) {
            console.log('Meteor login error')
            this.setState({error: 'Unable to login. Check email and password.'});
          } else {
            console.log('Meteor login success')
            this.setState({error: ''});
            this.props.history.replace('/dashboard');
          }
        })
      }
    });
  }
  render() {
    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Join</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
            <input type="email" ref="email" name="email" placeholder="Email"/>
            <input type="password" ref="password" name="password" placeholder="Password"/>
            <button className="button">Create Account</button>
          </form>

          <Link to="/">Have an account?</Link>
        </div>
      </div>
    );
  }
}
