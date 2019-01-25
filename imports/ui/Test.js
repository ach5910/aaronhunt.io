import React from 'react';
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import TestOutline from './TestOutline';

const createTestOutline = gql`
  mutation createTestOutline {
    createTestOutline {
      _id
    }
  }
`;


class Test extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            testOutlineId: "",
        }
    }

    generateTest = (e) => {
        e.preventDefault();
        this.props.createTestOutline({}).then(({data}) => {
            console.log('createTestOutline', data);
            this.setState({testOutlineId: data.createTestOutline._id});
        }).catch((error) => {
            console.log(error);
        })
    }

    render(){
        const {testOutlineId} = this.state;
        const {loading} = this.props;
        if (loading) return (<h1>Loading</h1>);
        return(
            <React.Fragment>
                {testOutlineId === "" 
                    ? (
                    <form onSubmit={this.generateTest.bind(this)} noValidate className="boxed-view__form">
                        <button type="submit" className="button">GenerateTest</button>
                    </form>)
                    : <TestOutline testOutlineId={testOutlineId}/>
                }
            </React.Fragment>
        )
    }
}

export default graphql(createTestOutline, {name: "createTestOutline"})(Test);