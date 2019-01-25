import React from 'react';
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import PrivateHeader from './PrivateHeader';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import Test from './Test';
import {
  CREATE_QUESTION_PAGE,
  LIST_QUESTION_PAGE,
  TEST_PAGE
} from '../startup/client/constants';

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      page: CREATE_QUESTION_PAGE
    }
    
  }

  onPageChange = (page) => {
    this.setState({page})
  }

  render(){
    const {questions, loading} = this.props;
    const {page} = this.state;
    return (
      <div className="backdrop">
        <PrivateHeader {...this.props} onPageChange={this.onPageChange} title="Dashboard"/>
        <div className="page-content">
          {page === CREATE_QUESTION_PAGE &&
            <QuestionForm />
          }
          {page === LIST_QUESTION_PAGE &&
            <QuestionList loading={loading} questions={questions}/>
          }
          {page === TEST_PAGE &&
            <Test />
          }
        </div>
      </div>
    );
  }
};

const questionsQuery = gql`
    query Questions {
    questions {
        _id
        text
        answers {
            text
            _id
            isAnswer
        }
    }
}
`;

export default graphql(questionsQuery, {
  props: ({ data }) => ({ ...data })
})(withApollo(Dashboard));
