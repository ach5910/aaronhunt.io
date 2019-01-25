import React from 'react';
import {Meteor} from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { render } from 'react-dom';
// import Answers from '../../api/answers/answers;'
import { ApolloLink, from } from 'apollo-link';
import { ApolloProvider} from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Routes from '../../routes/routes';
import { createBrowserHistory } from 'history';
// import App from '../../ui/App';
const httpLink = new HttpLink({
    uri: Meteor.absoluteUrl('graphql')
});

// const answers = Answers.find({}).fetch();
// console.log(answers);
let isAuthenticated;
const history = createBrowserHistory();
const cache = new InMemoryCache();

const authLink = new ApolloLink((operation, forward) => {
    const token = Accounts._storedLoginToken();
    operation.setContext(() => ({
        headers: {
            'meteor-login-token': token
        }
    }))
    return forward(operation);
});

const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache
});

// Tracker.autorun(() => {
//     isAuthenticated = !!Meteor.userId();
//     // onAuthChange(isAuthenticated);
// });

const ApolloApp = () => (
    <ApolloProvider client={client}>
        <Routes isAuthenticated={!!Meteor.userId()} history={history}/>
    </ApolloProvider>
)

Meteor.startup(() => {
    render(<ApolloApp  />, document.getElementById('app'));
});