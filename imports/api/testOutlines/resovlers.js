import TestOutlines from './testOutlines';
import Questions from '../questions/questions';
export default {
    Query: {
        testOutlines(obj, args) {
            return TestOutlines.find({}).fetch()
        },
        testOutline(obj, {testOutlineId}){
            return TestOutlines.findOne(testOutlineId);
        }
    },
    TestOutline: {
        questions: (testOutline ) => {
            return Questions.find({testOutlineId: testOutline._id}).fetch();
        }
    },
    Mutation: {
        createTestOutline(obj, args, { userId }) {
            if (userId){
                const questions = Questions.find({}).fetch();
                const spliced = questions.splice(-10, 10);
                const testOutlineId = TestOutlines.insert({
                    userIds: [userId]
                });
                spliced.forEach((question) => {
                    console.log(question);
                    Questions.update(question._id, {
                        $set: {
                            testOutlineId,
                        }
                    })
                })
                return TestOutlines.findOne(testOutlineId);
            }
            throw new Error("Unauthorized"); 
        }
    }
}