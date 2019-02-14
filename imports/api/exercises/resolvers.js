import Exercises from './exercises';
import Sets from '../sets/sets';
import Routines from '../routines/routines';
export default {
    Query: {
        exercises(obj, args, { userId }){
            return Exercises.find({user: userId}).fetch()
        }
    },
    Exercise: {
        sets: (exercise) => {
            return Sets.find({exerciseId: exercise._id}).fetch()
        }
    },
    Mutation: {
        createExercise(obj, {templateId}, {userId}) {
            if (userId){
                const exerciseId = Exercises.insert({
                    user: userId,
                    templateId
                });
                return Exercises.findOne(exerciseId);
            }
            throw new Error('Unauthorized');
        },
        addToRoutine(obj, {_id, routineId}, context){
            Routines.update(_id, {
                $set: {
                    routineId
                }
            })
            return Exercises.findOne(_id)
        },
        startExercise(obj, {_id}, context){
            const startTime = moment().unix();
            Exercises.update(_id, {
                $set: {
                    startTime
                }
            })
            return Exercises.findOne(_id);
        },
        endExercise(obj, {_id}, context){
            const endTime = moment().unix();
            Exercises.update(_id, {
                $set: {
                    endTime
                }
            })
            return Exercises.findOne(_id);
        }
    }
}