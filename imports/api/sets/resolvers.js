import Sets from './sets';

export default {
    Query: {
        sets(obj, args, {userId}){
            return Sets.find({user: userId}).fetch()
        }
    },
    Mutation: {
        createSet(obj, {weight, reps, setNumber, exerciseId}, {userId}){
            if (userId){
                const orm = weight * (1 + (reps / 30))
                const setId = Sets.insert({
                    user: userId,
                    weight,
                    reps,
                    orm,
                    exerciseId,
                    setNumber
                });
                return Sets.findOne(setId);
            }
            throw new Error('Unauthorized');
        },
        addToExercise(obj, {_id, exerciseId}, context){
            Sets.insert(_id, {
                $set: {
                    exerciseId
                }
            })
            return Sets.findOne(_id);
        }
    }
}