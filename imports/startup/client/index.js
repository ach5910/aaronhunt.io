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
import floatySpace from './canvas';
import classNames from 'classnames';
// import App from '../../ui/App';
const httpLink = new HttpLink({
    // uri: "http://localhost:3000"
    // uri: "http://10.0.0.3:3000/graphql"
    // uri: "http://192.168.50.61:3000/graphql"
    uri: Meteor.absoluteUrl('graphql')
});
window.cn = classNames
window.classNames = classNames
export const history = createBrowserHistory();
window.addEventListener('DOMContentLoaded', (event) => {
    let floaty = false;
    function checkFloaty(){
        if (!floaty){
            floaty = true;
            floatySpace()
        }
    }
    function toggleFloaty(loc){
        if (loc.pathname == "/"){
            console.log('list floaty');
            checkFloaty();
            document.getElementById("pt").style.display = "block"
        } else {
            console.log('list not floaty')
            floatySpace.destroy();
            floaty = false;
            document.getElementById("pt").style.display = "none"
        }
    }
    // if (history.location.pathname == "/"){
    //     checkFloaty()
    // }
    toggleFloaty(history.location);
    history.listen((loc) => {
        toggleFloaty(loc)
    })
    // document.getElementById("pt").style.display = "none";
});
// const answers = Answers.find({}).fetch();
// console.log(answers);

window.h = history;
// history.listen((p) => {console.log('p',p)} )
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