import Routines from './routines';
import Exercise from '../exercises/exercises'
import moment , { unix } from 'moment';
export default {
    Query: {
        routines(obj, args, {userId}){
            return Routines.find({user: userId}).fetch()
        }
    },
    Routine: {
        exercises: (routineId) => {
            return Exercise.find({routineId}).fetch()
        }
    },
    Mutation: {
        createRoutine(obj, {templateId}, {userId}){
            if (userId){
                const routineId = Routines.insert({
                    templateId,
                    user: userId
                })
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