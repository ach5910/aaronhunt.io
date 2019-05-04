import Routines from './routines';
import Exercises from '../exercises/exercises';
import RoutineTemplates from '../routineTemplates/routineTemplates';
import moment from 'moment';
export default {
    Query: {
        routines(obj, args, {userId}){
            if (userId){
                return Routines.find({user: userId, endTime: {$exists: true}}, {sort: {endTime: -1}}).fetch()
            }
            throw new Error("Unauthorized");
        },
        routine(obj, {_id}, context){
            return Routines.findOne(_id);
        },
        getMostRecentRoutine(obj, args, {userId}){
            if (userId){
                return Routines.findOne({user: userId}, {sort: {$natural: -1}})
            }
            throw new Error("Unauthorized");
        }
    },
    Routine: {
        exercises: (routine) => {
            if (routine.exerciseIds == null) return [];
            var pipeline = [
                {$match: {_id: {$in: routine.exerciseIds}}},
                {$addFields: {"__order": {$indexOfArray: [routine.exerciseIds, "$_id" ]}}},
                {$sort: {"__order": 1}}
               ];
            var result = Exercises.aggregate(pipeline);
            return result;
        },
        name: (routine) => {
            const routineTemplate = RoutineTemplates.findOne(routine.templateId);
            return routineTemplate.name;
        }
    },
    Mutation: {
        createRoutine(obj, {templateId, exerciseTemplateIds = []}, {userId}){
            if (userId){
                const exerciseIds = [];
                exerciseTemplateIds.forEach(exerciseTemplateId => {
                    let exerciseId = Exercises.insert({
                        user: userId,
                        templateId: exerciseTemplateId
                    })
                    exerciseIds.push(exerciseId)
                })
                const startTime = moment().valueOf().toString();
                const routineId = Routines.insert({
                    templateId,
                    user: userId,
                    exerciseIds,
                    startTime
                })
                return Routines.findOne(routineId);
            }
            throw new Error("Unauthorized")
        },
        startRoutine(obj, {_id}, context){
            const startTime = moment().valueOf().toString();
            Routines.update(_id, {
                $set: {
                    startTime
                }
            })
            return Routines.findOne(_id);
        },
        endRoutine(obj, {_id}, context){
            const endTime = moment().valueOf().toString();
            Routines.update(_id, {
                $set: {
                    endTime
                }
            })
            return Routines.findOne(_id);
        },
        addExercise(obj, {_id, exerciseTemplateId}, {userId}){
            if (userId){
                const routine = Routines.findOne(_id);
                RoutineTemplates.update({_id: routine.templateId}, {
                    $addToSet:{
                        exerciseTemplateIds: exerciseTemplateId
                    }
                })
                const exerciseId = Exercises.insert({
                    user: userId,
                    templateId: exerciseTemplateId
                })
                Routines.update({_id}, {
                    $addToSet: {
                        exerciseIds: exerciseId
                    }
                })
                return Routines.findOne(_id);
            }
            throw new Error("Unauthorized");
        },
        removeExercise(obj, {_id, exerciseId}, {userId}){
            if (userId){
                Routines.update({_id}, {
                    $pull: {
                        exerciseIds: exerciseId
                    }
                })
                return Routines.findOne(_id);
            }
            throw new Error('Unauthorized');
        }
    }
}