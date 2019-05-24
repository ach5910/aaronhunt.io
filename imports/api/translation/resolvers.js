import Translations from './translations';

export default {
    Query: {
        translations(obj, args, context){
            return Translations.find().fetch()
        }
    },
    Mutation: {
        createTranslation(obj, {en, tr}, context){
            const _id = Translations.insert({
                en,
                tr
            })
            return Translations.findOne(_id);
        }
    }
}