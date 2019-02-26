import Routines from './routines';
import Exercises from '../exercises/exercises';
import RoutineTemplates from '../routineTemplates/routineTemplates';
import moment , { unix } from 'moment';
export default {
    Query: {
        routines(obj, args, {userId}){
            return Routines.find({user: userId}).fetch()
        },
        routine(obj, {_id}, context){
            return Routines.findOne(_id);
        }
    },
    Routine: {
        exercises: (routine) => {
            if (routine.exerciseIds == null) return [];
            console.log('Routine exercises - ids', routine.exerciseIds)
            var pipeline = [
                {$match: {_id: {$in: routine.exerciseIds}}},
                {$addFields: {"__order": {$indexOfArray: [routine.exerciseIds, "$_id" ]}}},
                {$sort: {"__order": 1}}
               ];
            var result = Exercises.aggregate(pipeline);
            console.log('Routine exercises - result', result)
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
                    console.log('exerciseIds', exerciseIds);
                })
                const startTime = moment().unix()
                const routineId = Routines.insert({
                    templateId,
                    user: userId,
                    exerciseIds,
                    startTime
                })
                console.log('routineId  exerciseIds', routineId, exerciseIds)
                return Routines.findOne(routineId);
            }
            throw new Error("Unauthorized")
        },
        startRoutine(obj, {_id}, context){
            const startTime = moment().unix()
            Routines.update(_id, {
                $set: {
                    startTime
                }
            })
            return Routines.findOne(_id);
        },
        endRoutine(obj, {_id}, context){
            const endTime = moment().unix();
            Routines.update(_id, {
                $set: {
                    endTime
                }
            })
            return Routines.findOne(_id);
        }
    }
}