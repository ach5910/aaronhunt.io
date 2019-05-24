import { createApolloServer} from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';

import merge from 'lodash/merge';
// import QuestionResolvers from '../../api/questions/resolvers';
// import AnswerResolvers from '../../api/answers/resolvers';
// import TestOutlineResolvers from '../../api/testOutlines/resovlers';
// import UserQuestionResolvers from '../../api/userQuestions/resolvers';
// import UserTestResolvers from '../../api/userTests/resolvers';
import RoutineResolvers from '../../api/routines/resolvers';
import RoutineTemplateResolvers from '../../api/routineTemplates/resolvers';
import ExerciseResolvers from '../../api/exercises/resolvers';
import ExerciseTemplateResolvers from '../../api/exerciseTemplates/resolvers';
import SetResolvers from '../../api/sets/resolvers';
import TagResolvers from '../../api/tags/resolvers';
import TranslationResolvers from '../../api/translation/resolvers';
// import GoalResolvers from '../../api/goals/resolvers';
// import ResolutionResolvers from '../../api/resolutions/resolvers';
// impordt UserResolvers from '../../api/users/resolvers';

// import QuestionsSchema from '../../api/questions/Questions.graphql';
// import AnswersSchema from '../../api/answers/Answers.graphql';
// import TestOutlinesSchema from '../../api/testOutlines/TestOutlines.graphql';
// import UserQuestionsSchema from '../../api/userQuestions/UserQuestions.graphql';
// import UserTestsSchema from '../../api/userTests/UserTests.graphql';
import RoutinesSchema from '../../api/routines/Routines.graphql';
import RoutineTemplatesSchema from '../../api/routineTemplates/RoutineTemplates.graphql';
import ExercisesSchema from '../../api/exercises/Exercises.graphql';
import ExerciseTemplatesSchema from '../../api/exerciseTemplates/ExerciseTemplates.graphql';
import SetsSchema from '../../api/sets/Sets.graphql';
import TagsSchema from '../../api/tags/Tags.graphql';
import TranslationsSchema from '../../api/translation/Translations.graphql';
// import GoasssdflsScddllsshema from '../../api/goals/Goals.graphql';
// import ResolutionsSchema from 'ssss../../api/resolutions/Resolutions.graphql';
// import sssUsersSciihema from '../../api/users/Users.graphql';

//////sssssslld/assdssddssssdsssssssssssdsdfsasdsfsssadfasdddgsfasdasfdddsfsfsdddddddfdskk
//////sfddssaddddddrsadwsdsdppppssdpskksddsssssfsssspssssssooooasssxasdfdfasDsdfiiidfsdddddssdddddss
const typeDefs = [
    // QuestionsSchema,
    // AnswersSchema,
    // TestOutlinesSchema,
    // UserQuestionsSchema,
    // UserTestsSchema,
    RoutinesSchema,
    RoutineTemplatesSchema,
    ExercisesSchema,
    ExerciseTemplatesSchema,
    SetsSchema,
    TagsSchema,
    TranslationsSchema
];

const resolvers = merge(
    // QuestionResolvers,
    // AnswerResolvers,
    // TestOutlineResolvers,
    // UserQuestionResolvers,
    // UserTestResolvers,
    RoutineResolvers,
    RoutineTemplateResolvers,
    ExerciseResolvers,
    ExerciseTemplateResolvers,
    SetResolvers,
    TagResolvers,
    TranslationResolvers
);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

createApolloServer({schema});