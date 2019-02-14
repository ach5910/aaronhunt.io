import RoutineTemplates from './routineTemplates';
import ExerciseTemplates from '../exerciseTemplates/exerciseTemplates';
import Routines from '../routines/routines';

export default {
    Query: {
        routineTemplates(obj, args, {userId}){
            return RoutineTemplates.find({createdBy: userId}).fetch()
        }
    },
    RoutineTemplate: {
        exerciseTemplates: (routineTemplateId) => {
            return ExerciseTemplates.find({routineTemplateId}).fetch()
        },
        routines: (routineTemplateId) => {
            return Routines.find({templateId: routineTemplateId}).fetch()
        }
    },
    Mutation: {
        createRoutineTemplate(obj, {name, exerciseTemplateIds = []}, {userId}){
            if (userId){
                const routineTemplateId = RoutineTemplates.insert({
                    name,
                    createdBy: userId,
                })
                ExerciseTemplates.update({_id: {$in: exerciseTemplateIds}}, {
                    $addToSet: {routineTemplateIds: routineTemplateId}
                },  {multi: true})
                return RoutineTemplates.findOne(routineTemplateId);
            }
            throw new Error('Unauthorized');
        },
        updateRoutineTemplate(obj, {_id, name, oldExerciseTemplateIds, newExerciseTemplateIds}, context){
            const removeIds = oldExerciseTemplateIds.filter(id => !newExerciseTemplateIds.includes(id))
            const addIds = newExerciseTemplateIds.filter(id => oldExerciseTemplateIds.includes(id))
            ExerciseTemplates.update({_id: {$in: removeIds}}, {
                $pullAll : {routineTemplateIds: _id}
            }, {multi: true})
            ExerciseTemplates.update({_id: {$in: addIds}}, {
                $addToSet: {routineTemplateIds: _id}
            }, {multi: true})
            RoutineTemplates.update({_id}, {
                name
            })
            return RoutineTemplates.findOne(_id);
        }
    }
}