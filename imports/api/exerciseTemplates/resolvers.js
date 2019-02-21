import ExerciseTemplates from './exerciseTemplates';
import Exercises from '../exercises/exercises';
import Tags from '../tags/tags';

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