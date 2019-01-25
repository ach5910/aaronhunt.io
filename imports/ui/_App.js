import React from 'react';
import gql from 'graphql-tag';
import RegisterForm from './RegisterForm';
import { graphql } from 'react-apollo';
import ResolutionForm from './ResolutionForm';
import GoalForm from './GoalForm';
import LoginForm from './LoginForm';
import Goal from './resolutions/Goal';
import { withApollo } from 'react-apollo';

const App = ({loading, resolutions, client, user}) => {
    if (loading) return <h1>hi</h1>;
    return (
        <div>
            { user._id ? (
                <button 
                    onClick={() => {
                        Meteor.logout();
                        client.resetStore();
                    }}
                >Logout</button>
                ) : (
                <div>
                    <LoginForm client={client}/>
                    <RegisterForm client={client}/>
                </div>

            )}
            <ResolutionForm />
            <h1>List</h1>
            <ul>
                {resolutions.map(resolution => (
                    <li key={resolution._id}>
                        <span style={{textDecoration: resolution.completed ? "line-through": "none"}}>{resolution.name}</span>
                        <ul>
                            {resolution.goals.map(goal => (
                                <Goal goal={goal} key={goal._id}/>
                            ))}
                        </ul>
                        <GoalForm resolutionId={resolution._id} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

const resolutionsQuery = gql`
    query Resolutions {
    resolutions {
        _id
        name
        completed
        goals {
            name
            _id
            completed
        }
    }
    user {
        _id
    }
}
`;

export default graphql(resolutionsQuery, {
    props: ({ data }) => ({ ...data })
})(withApollo(App));