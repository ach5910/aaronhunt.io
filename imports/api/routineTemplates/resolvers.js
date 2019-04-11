import {Meteor} from 'meteor/meteor';
import RoutineTemplates from './routineTemplates';
import ExerciseTemplates from '../exerciseTemplates/exerciseTemplates';
import Routines from '../routines/routines';

export default {
    Query: {
        routineTemplates(obj, args, {userId}){
            if (userId){
                return RoutineTemplates.find({createdBy: userId}).fetch()
            }
            throw new Error("Unauthorized");
        }
    },
    RoutineTemplate: {
        exerciseTemplates: (routineTemplate) => {
            // const routineTemplate = RoutineTemplates.findOne(rout)
            // console.log('routineTemplate', routineTemplate);
            if (routineTemplate.exerciseTemplateIds == null) return [];
            // var rawExerciseTemplates = ExerciseTemplates.rawCollection();
            // var aggregateQuery = Meteor.wrapAsync(rawExerciseTemplates.aggregate, rawExerciseTemplates);
            var pipeline = [
                {$match: {_id: {$in: routineTemplate.exerciseTemplateIds}}},
                {$addFields: {"__order": {$indexOfArray: [routineTemplate.exerciseTemplateIds, "$_id" ]}}},
                {$sort: {"__order": 1}}
               ];
            var result = ExerciseTemplates.aggregate(pipeline);
            return result;
            // var query = 
            // //    [{$match: {_id: {$in: routineTemplate.exerciseTemplateIds}}}],{ cursor: {}}
            // const cursor = ExerciseTemplates.aggregate(query, {cursor: {batchSize: 0}}, resultCallback(err, res){
            //     return res
            // });
            // return cursor.resultCallback(function(err, res){
            //     console.log('res', res);
            //     return res;
            // })
            // console.log('toArrary', result.toArray())
            // console.log('result' ,result)
            // return result.toArray();
            // const res = ExerciseTemplates.find({
            //     _id: {
            //         $in: routineTemplate.exerciseTemplateIds
            //     }
            // }).fetch()
            // console.log('res',res)
            // return res;
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
                    exerciseTemplateIds
                })
                // ExerciseTemplates.update({_id: {$in: exerciseTemplateIds}}, {
                //     $addToSet: {routineTemplateIds: routineTemplateId}
                // },  {multi: true})
                return RoutineTemplates.findOne(routineTemplateId);

            }
            throw new Error('Unauthorized');
        },
        deleteRoutineTemplate(obj, {_id}, {userId}){
            if (userId){
                return RoutineTemplates.remove({_id})
            }
            throw new Error('Unauthorized');
        },
        updateRoutineTemplate(obj, {_id, name, exerciseTemplateIds}, context){
            // console.log('old new ids', oldExerciseTemplateIds, newExerciseTemplateIds);
            // const removeIds = oldExerciseTemplateIds.filter(id => !newExerciseTemplateIds.includes(id))
            // const addIds = newExerciseTemplateIds.filter(id => !oldExerciseTemplateIds.includes(id))
            // ExerciseTemplates.update({_id: {$in: removeIds}}, {
            //     $pull : {routineTemplateIds: _id}
            // }, {multi: true})
            // ExerciseTemplates.update({_id: {$in: addIds}}, {
            //     $addToSet: {routineTemplateIds: _id}
            // }, {multi: true})
            RoutineTemplates.update({_id}, {
                $set: {
                    name,
                    exerciseTemplateIds
                }
            })
            return RoutineTemplates.findOne(_id);
        }
    }
}