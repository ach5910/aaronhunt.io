import React from 'react';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";

const createUserQuestion = gql`
    mutation createUserQuestion($userTestId: String!, $questionId: String!, $answerId: String!, $score: Int){
        createUserQuestion(userTestId: $userTestId, questionId: $questionId, answerId: $answerId, score: $score){
            _id
        }
    }
`;

const submitUserTest = gql`
    mutation submitUserTest($userTestId: String!, $score: Int){
        submitUserTest(userTestId: $userTestId, score: $score){
            _id
        }
    }
`;

const createUserTest = gql`
    mutation createUserTest($testOutlineId: String!){
        createUserTest(testOutlineId: $testOutlineId){
            _id
        }
    }
`;

const letters = ["A", "B", "C", "D"];

class TestOutline extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            questionNumber: 0,
            userTestId: "",
            score: 0,
            multiplier: 1,
            answerIndex: "",
            mins: "00",
            secs: "11"
        }
    }

    submitAnswer = (e) => {
        e.preventDefault();
        const {answerIndex, questionNumber, multiplier, score, userTestId} = this.state;
        const {testOutline} = this.props;
        const correctAnswer = testOutline.questions[questionNumber].answers[answerIndex].isAnswer;
        const newScore = score + (multiplier * 100);
        let newMultiplier = correctAnswer ? multiplier + 1 : 1;
        this.props.createUserQuestion({
            variables: {
                userTestId, 
                questionId: testOutline.questions[questionNumber]._id,
                answerId: testOutline.questions[questionNumber].answers[answerIndex]._id,
                score: newScore
            }
        }).then(({data}) => {
            console.log('createUserQuestion', data);
            if (questionNumber + 1 === testOutline.questions.length){
                this.props.submitUserTest({
                    variables: {
                        userTestId,
                        score: newScore
                    }
                }).then(({data}) => {
                    console.log('submitUserTest',data)
                }).catch((error) => {
                    console.log(error);
                })
            }
        }).catch((error) => {
            console.log(error)
        });
        this.setState({multiplier: newMultiplier, score: newScore, questionNumber: questionNumber + 1})
    }

    tick = () => {
        this.secondsRemaining--;
        let mins =  Math.floor(this.secondsRemaining / 60);
        let secs = this.secondsRemaining - (mins * 60);
        if (secs < 10){
            secs = "0" + secs;
        }
        if (mins < 10){
            mins = "0" + mins;
        }
        this.setState({mins, secs});
        if (secs == 0){
            clearInterval(this.handleTime);
        }
    }

    startTimer = () => {
        this.secondsRemaining = 11;
        this.handleTime = setInterval(this.tick, 1000);
    }

    startUserTest = (e) => {
        e.preventDefault();
        const {testOutlineId} = this.props;
        this.props.createUserTest({
            variables: {
                testOutlineId
            }
        }).then(({data}) => {
            console.log('CreateUserTest', data);
            this.setState({userTestId: data.createUserTest._id})
            this.startTimer();
        }).catch((error) => {
            console.log(error);
        })
    }

    handleRadioChange = (answerIndex) => {this.setState({answerIndex})}

    render(){
        const {userTestId, questionNumber, answerIndex, score, multiplier, mins, secs} = this.state;
        const {loading, testOutline} = this.props;
        if (loading) return (<h1>Loading</h1>);
        return(
            <React.Fragment>
                {userTestId === "" &&
                    <form onSubmit={this.startUserTest.bind(this)} noValidate className="boxed-view__form">
                        <button type="submit" className="button">StartTest</button>
                    </form>
                }
                {userTestId !== "" && testOutline.questions.length > questionNumber &&
                    <React.Fragment>
                        <br/>
                        
                        <div className="scoreboard">
                            <div className="scoreboard__score">Score: {score}</div>
                            <h2>Time Remaining: {mins}:{secs}</h2>
                            <div className="scoreboard__multiplier">Multiplier: x{multiplier}</div>
                        </div>
                        
                        <div className="boxed-view__box boxed-view__question-box">
                            <form onSubmit={this.submitAnswer.bind(this)} noValidate className="boxed-view__form">
                                <h2>{testOutline.questions[questionNumber].text}</h2>
                                {testOutline.questions[questionNumber].answers.map((answer, idx) => (
                                    <div className="answer-container">
                                        <div 
                                            className={`answer-container__radio ${answerIndex === idx ? "selected": ""}`}
                                            onClick={() => this.handleRadioChange(idx)}
                                            style={{marginRight: "10px"}}
                                        >{letters[idx]}</div>
                                        <p>{answer.text}</p>
                                    </div>
                                ))}
                                <button type="submit" className="button">Submit</button>
                            </form>
                        </div>
                    </React.Fragment>
                }
                {userTestId !== "" && (testOutline.questions.length <= questionNumber || secs == 0)  &&
                    <React.Fragment>
                        <div className="boxed-view__form">
                            <h1>Final Score:{score}</h1>
                            <div className="answer-container">
                                The Test is over
                            </div>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

const testOutlineQuery = gql`
    query testOutline($testOutlineId: String!) {
    testOutline(testOutlineId: $testOutlineId) {
        _id
        userIds
        questions {
            _id
            text
            answers{
                _id
                text
                isAnswer
            }
        }
    }
}`;

export default compose(graphql(testOutlineQuery, {
    props: ({ data }) => ({ ...data }),
    options: ({testOutlineId}) => ({variables: {testOutlineId}})
}),
graphql(createUserQuestion, {name: "createUserQuestion"}),
graphql(createUserTest, {name: "createUserTest"}),
graphql(submitUserTest, {name: "submitUserTest"}))(TestOutline);