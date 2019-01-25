import React from 'react';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";

const createQuestion = gql`
  mutation createQuestion($text: String!) {
    createQuestion(text: $text) {
      _id
    }
  }
`;

const createAnswer = gql`
  mutation createAnswer($text: String!, $questionId: String!, $isAnswer: Boolean){
    createAnswer(text: $text, questionId: $questionId, isAnswer: $isAnswer){
      _id
    }
  }
`;

const letters = ["A", "B", "C", "D"];

class QuestionForm extends React.Component{
    constructor(props){
        super(props);
        this.state={radio: 0}
        this.answers = [null, null, null, null];
    }

    onSubmit(e){
        e.preventDefault();
        const {radio} = this.state;
        this.props.createQuestion({
          variables: {
            text: this.question.value.trim()
          }
        }).then(({data}) => {
          this.question.value = "";
          const questionId = data.createQuestion._id;
          console.log('questionId', questionId)
          let i = 0;
          for(i; i < 4; i++){
            this.props.createAnswer({
              variables: {
                text: this.answers[i].value.trim(),
                questionId,
                isAnswer: i === radio
              }
            }).catch((error) => {
              console.log(error)
            })
            this.answers[i].value = "";
          }
        }).catch((error) => {
          console.log(error);
        })
    }

    handleRadioChange = (radio) => {
        this.setState({radio});
    }

    render(){
        const {radio} = this.state;
        return(
            <React.Fragment>
                <h1>Create a new question</h1>
                <div className="boxed-view__box boxed-view__question-box">
                    <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
                    <input type="text" ref={el => this.question = el} placeholder="Question"/>
                    {letters.map((letter, idx) => (
                        <div className="answer-container">
                        <div 
                            className={`answer-container__radio ${radio === idx ? "selected": ""}`}
                            onClick={() => this.handleRadioChange(idx)}
                            style={{marginRight: "10px"}}
                            >{letter}</div>
                        <input type="text" style={{width: "100%"}} ref={el => this.answers[idx] = el} placeholder="Enter an answer"/>
                        </div>
                    ))}
                    <button type="submit" className="button">Create</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default compose(graphql(createQuestion, {
  name: "createQuestion",
  options: {
    refetchQueries: ["Questions"]
}}),
graphql(createAnswer, {name: "createAnswer"}))(QuestionForm);