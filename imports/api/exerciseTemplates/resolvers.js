import ExerciseTemplates from './exerciseTemplates';
import Exercises from '../exercises/exercises';
import Tags from '../tags/tags';
import Sets from '../sets/sets';

export default {
    Query: {
        exerciseTemplates(obj, args, { userId }){
            return ExerciseTemplates.find({createdBy: userId}).fetch()
        }
    },
    ExerciseTemplate: {
        exercises: (templateId) => {
            return Exercises.find({templateId}).fetch()
        },
        tags: (exerciseTemplate) => {
            // const exerciseTemplate = ExerciseTemplates.findOne(templateId);
            return Tags.find({_id: {$in: exerciseTemplate.tagIds}}).fetch()
        },
        topExerciseStats: (exerciseTemplate) => {
            const result = Exercises.aggregate([
                {$match: {templateId: exerciseTemplate._id}},
                {$project: {templateId: 1}},
                {$lookup: {from: "sets", localField: "_id", foreignField: "exerciseId", as: "set_exercises"}},
                {$unwind: "$set_exercises"},
                {$group :{_id: "$set_exercises.exerciseId", tWeight: {$sum: "$set_exercises.weight"}, tReps: {$sum: "$set_exercises.reps"}, bestORM: {$max: "$set_exercises.orm"}, templateId: {$first:"$templateId"},}},
                {$group: {_id: "$templateId", totalWeight: {$max: "$tWeight"}, totalReps: {$max: "$tReps"}, topORM: {$max: "$bestORM"}}},
            ])
            console.log('result', result)
            if (result.length === 0){
                return {totalWeight: 0, totalReps: 0, topORM: 0}
            }
            return result[0];
        }
    },
    Mutation: {
        createExerciseTemplate(obj, {name, tagIds= []}, {userId}) {
            if (userId){
                const exerciseTemplateId = ExerciseTemplates.insert({
                    name,
                    createdBy: userId,
                    tagIds,
                });
                return ExerciseTemplates.findOne(exerciseTemplateId);
            }
            throw new Error('Unauthorized');
        },
        updateExerciseTemplate(obj, {_id, name, tagIds}, context){
            ExerciseTemplates.update(_id, {
                $set: {
                    name,
                    tagIds
                }
            });
            return ExerciseTemplates.findOne(_id);
        }
    }
}