import React from 'react';
// import gql from "graphql-tag";
// import { graphql, compose } from "react-apollo";

const letters = ["A", "B", "C", "D"];

class QuestionList extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {questions, loading} = this.props;
        console.log('questions', questions);
        if (loading) return (<h1 className="workout--h1">Loading</h1>);
        return(
            <React.Fragment>
                <h1 className="workout--h1">Question List:</h1>
                {questions.map((question) => (
                    <div className="boxed-view__box boxed-view__question-box">
                        <div className="boxed-view__form">
                        <h2 className="workout--h2">{question.text}</h2>
                        {question.answers.map((answer, idx) => (
                            <div className="answer-container">
                            <div 
                                className={`answer-container__radio ${answer.isAnswer ? "selected": ""}`}
                                style={{marginRight: "10px"}}
                                >{letters[idx]}</div>
                            <p className="workout--paragraph">{answer.text}</p>
                            </div>
                        ))}
                        </div>
                    </div>))
                }
            </React.Fragment>
        )
    }
}

export default QuestionList;