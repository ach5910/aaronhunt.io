import Sets from './sets';

export default {
    Query: {
        sets(obj, args, {userId}){
            if (userId){
                return Sets.find({user: userId}).fetch()
            }
            throw new Error("Unauthorized");
        }
    },
    Mutation: {
        createSet(obj, {weight, reps, exerciseId}, {userId}){
            if (userId){
                const orm = weight * (1 + (reps / 30))
                const lastSet = Sets.aggregate([
                    {$match: {exerciseId}},
                    {$group: {_id: exerciseId, setNumber: {$max: "$setNumber"}}}
                ])
                let nextSetNumber = 1
                if (lastSet.length !== 0){
                    nextSetNumber = lastSet[0].setNumber + 1;
                }
                // if (nextSetNumber !== setNumber){
                //     console.log('error setNumber and nextSetNumber dont match - nextSetNumber - setNumber', nextSetNumber, setNumber )
                // }
                // @TODO - stop tracking setNumber in react state. The current set and updates should come from backend
                const setId = Sets.insert({
                    user: userId,
                    weight,
                    reps,
                    orm,
                    exerciseId,
                    setNumber: nextSetNumber
                });
                return Sets.findOne(setId);
            }
            throw new Error('Unauthorized');
        },
        updateSets(obj, {sets, exerciseId}, {userId}){
            if (userId){
                sets.forEach(set => {
                    Sets.update({_id: set._id},  {
                        $set: {
                            weight: set.weight,
                            reps: set.reps,
                            orm: set.weight * (1 + (set.reps / 30))
                        }
                    })
                })
                return Sets.find({exerciseId});
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
        },
        editSet(obj, {_id, weight, reps}, context){
            Sets.update(_id, {
                $set: {
                    weight,
                    reps,
                    orm: weight * (1 + (reps / 30))
                }
            })
            return Sets.findOne(_id);
        }
    }
}