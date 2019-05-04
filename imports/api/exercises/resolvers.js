import Exercises from './exercises';
import Sets from '../sets/sets';
import Routines from '../routines/routines';
import ExerciseTemplates from '../exerciseTemplates/exerciseTemplates';
import  moment from 'moment';
export default {
    Query: {
        exercises(obj, args, { userId }){
            if (userId){
                return Exercises.find({user: userId}).fetch()
            }
            throw new Error("Unauthorized");
        },
        exercise(obj, {_id}, {userId}){
            return Exercises.findOne(_id)
        }
    },
    Exercise: {
        sets: (exercise) => {
            return Sets.find({exerciseId: exercise._id}, {sort: {setNumber: 1}})
        },
        name: (exercise) => {
            const exerciseTemplate = ExerciseTemplates.findOne(exercise.templateId);
            return exerciseTemplate.name;
        },
        previousExercise: (exercise) => {
            return Exercises.find({templateId: exercise.templateId, user: exercise.user, endTime: {$type: "string"}, _id : {$ne: exercise._id}}, {sort: {endTime: -1}}).fetch()[0]
            // const pipeline = [
            //     {$match: { templateId: exercise.templateId , user: exercise.user}},
            //     {$sort: { endTime: -1}},
            //     {$limit: 1},
            //     ];
            // return Exercises.aggregate(pipeline);
        },
        exerciseTemplate: (exercise) => {
            return ExerciseTemplates.findOne(exercise.templateId)
        },
        exerciseStats: (exercise) => {
            const result = Sets.aggregate([
                {$match: { exerciseId: exercise._id}},
                {$lookup: {from: "exercises", localField: "exerciseId", foreignField: "_id", as: "set_exercises"}}, 
                {$replaceRoot : { newRoot : {$mergeObjects: [{ $arrayElemAt : ["$set_exercises", 0]}, "$$ROOT"]}}},
                {$project: {set_exercises: 0}}, 
                {$group :{_id: "$exerciseId", totalWeight: {$sum: "$weight"}, totalReps: {$sum: "$reps"}, topORM: {$max: "$orm"}, templateId: {$first:"$templateId"},}},
                {$project: {calcExTemps: 0, tagIds: 0, name: 0, createdBy: 0, routineTemplateIds: 0}}
            ])
            if (result.length === 0){
                return {totalWeight: 0, totalReps: 0, topORM: 0}
            }
            return result[0];
        }
    },
    Mutation: {
        cancelExercise(obj, {_id, setIds}, {userId}){
            if (userId){
                setIds.forEach((_id) => {
                    Sets.remove({_id});
                })
                Exercises.update(_id, {
                    $set: {
                        startTime: null
                    }
                });
                return Exercises.findOne(_id);
            }
            throw new Error('Unauthorized');
        },
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
        deleteExercise(obj, {_id}, {userId}){
            if(userId){
                Exercises.remove({_id});
                return true;
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
        startExercise(obj, {_id, sets}, {userId}){
            if(userId){
                const startTime = moment().valueOf().toString();
                sets.forEach((set) => {
                    Sets.insert({...set, user: userId, exerciseId: _id})
                })
                // console.log('userSets', userSets)
                // const result = Sets.insert(userSets);
                // console.log(result);
                Exercises.update(_id, {
                    $set: {
                        startTime
                    }
                })
                return Exercises.findOne(_id);
            }
            throw new Error('Unauthorized');
        },
        endExercise(obj, {_id}, context){
            const endTime = moment().valueOf().toString();
            Exercises.update(_id, {
                $set: {
                    endTime
                }
            })
            return Exercises.findOne(_id);
        },
        deleteSet(obj, {setId}, context){
            const set = Sets.findOne({_id: setId});
            Sets.remove({_id: setId});
            Sets.update(
                {exerciseId: set.exerciseId,setNumber: {$gt: set.setNumber}},
                {$inc: {setNumber: -1}},
                {multi: true})
            return Exercises.findOne({_id: set.exerciseId})
        }
    }
}