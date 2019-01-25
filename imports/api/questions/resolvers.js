import Questions from './questions';
import Answers from '../answers/answers';
export default {
    Query: {
        questions(obj, args, { userId}) {
            return Questions.find({userId}).fetch()
        }
    },
    Question: {
        answers: (question) => {
            return Answers.find({questionId: question._id}).fetch()
        }
        // correctAnswerId: (correctAnswerId) => {
        //     return Answers.find(correctAnswerId).fetch()
        // }
    },
    Mutation: {
        createQuestion(obj, {text}, { userId }) {
            if (userId){
                const questionId = Questions.insert({
                    text,
                    userId,
                });
                return Questions.findOne(questionId);
            }
            throw new Error("Unauthorized"); 
        },
    }
}