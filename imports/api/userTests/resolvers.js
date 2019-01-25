import UserTests from './userTests';
import UserQuestions from '../userQuestions/userQuestions';
export default {
    Query: {
        userTests(obj, args) {
            return UserTests.find({}).fetch()
        }
    },
    UserTest: {
        userQuestions: (userTest) => {
            return UserQuestions.find({userTestId: userTest._id}).fetch();
        }
    },
    Mutation: {
        createUserTest(obj, {testOutlineId}, { userId }) {
            if (userId){
                const userTestId = UserTests.insert({
                    testOutlineId,
                    userId,
                    score: 0
                });
                return UserTests.findOne(userTestId);
            }
            throw new Error("Unauthorized"); 
        },
        submitUserTest(obj, {userTestId, score}, {userId}){
            if (userId){
                UserTests.update(userTestId, {
                    $set: {
                        score
                    }
                })
                return UserTests.findOne(userTestId);
            }
        }
    }
}