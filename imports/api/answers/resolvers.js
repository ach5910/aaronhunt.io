import Answers from './answers';
import Questions from '../questions/questions';
export default {
    Query: {
        answers(obj, args) {
            return Answers.find({}).fetch()
        }
    },
    Mutation: {
        createAnswer(obj, { text, questionId, isAnswer }, { userId }) {
            if (userId){
                const answerId = Answers.insert({text, questionId, isAnswer});
                return Answers.findOne(answerId);
            }
            throw new Error("Unauthorized"); 
        }
    }
}