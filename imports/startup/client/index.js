import React from 'react';
import {Meteor} from 'meteor/meteor';
import { render } from 'react-dom';
// import Answers from '../../api/answers/answers;'
import { ApolloLink, from } from 'apollo-link';
import { ApolloProvider} from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Routes from '../../routes/liftRoutes';
import { createBrowserHistory } from 'history';
// import App from '../../ui/App';
const httpLink = new HttpLink({
    uri: "http://10.0.0.3:3000/graphql"//Meteor.absoluteUrl('graphql')/
});

// const answers = Answers.find({}).fetch();
// console.log(answers);
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


const ApolloApp = () => (
    <ApolloProvider client={client}>
        <Routes history={history}/>
    </ApolloProvider>
)

Meteor.startup(() => {
    render(<ApolloApp  />, document.getElementById('app'));
});