import UserQuestions from './userQuestions';
import Question from '../questions/questions';
import Answer from '../answers/answers';
export default {
    Query: {
        userQuestions(obj, args) {
            return UserQuestions.find({}).fetch()
        }
    },
    Mutation: {
        createUserQuestion(obj, {userTestId, questionId, answerId, score}, { userId }) {
            if (userId){
                const question = Question.findOne(questionId);
                const answer = Answer.findOne(answerId);
                const userQuestionId = UserQuestions.insert({
                    userTestId,
                    question,
                    answer,
                    score,
                    userId
                });
                return UserQuestions.findOne(userQuestionId);
            }
            throw new Error("Unauthorized"); 
        }
    }
}