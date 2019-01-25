import { createApolloServer} from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';

import merge from 'lodash/merge';
import QuestionResolvers from '../../api/questions/resolvers';
import AnswerResolvers from '../../api/answers/resolvers';
import TestOutlineResolvers from '../../api/testOutlines/resovlers';
import UserQuestionResolvers from '../../api/userQuestions/resolvers';
import UserTestResolvers from '../../api/userTests/resolvers';
// import GoalResolvers from '../../api/goals/resolvers';
// import ResolutionResolvers from '../../api/resolutions/resolvers';
// import UserResolvers from '../../api/users/resolvers';

import QuestionsSchema from '../../api/questions/Questions.graphql';
import AnswersSchema from '../../api/answers/Answers.graphql';
import TestOutlinesSchema from '../../api/testOutlines/TestOutlines.graphql';
import UserQuestionsSchema from '../../api/userQuestions/UserQuestions.graphql';
import UserTestsSchema from '../../api/userTests/UserTests.graphql';
// import GoalsSchema from '../../api/goals/Goals.graphql';
// import ResolutionsSchema from '../../api/resolutions/Resolutions.graphql';
// import UsersSchema from '../../api/users/Users.graphql';

/////////asdfasfsadfasdfasdasfdsfsfsdddddd
//////sfaddddddrsafassadfasDsdfiiidfsdddddssdd
const typeDefs = [
    QuestionsSchema,
    AnswersSchema,
    TestOutlinesSchema,
    UserQuestionsSchema,
    UserTestsSchema
];

const resolvers = merge(
    QuestionResolvers,
    AnswerResolvers,
    TestOutlineResolvers,
    UserQuestionResolvers,
    UserTestResolvers
);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

createApolloServer({schema});