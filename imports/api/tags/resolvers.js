import Tags from './tags';

export default {
    Query: {
        tags(obj, args, context){
            return Tags.find({}).fetch();
        }
    },
    Mutation: {
        createTag(obj, {name}, {userId}){
            if (userId){
                const tagId = Tags.insert({
                    name,
                    user: userId
                });
                return Tags.findOne(tagId);
            }
            throw new Error("Unauthorized");
        }
    }
}