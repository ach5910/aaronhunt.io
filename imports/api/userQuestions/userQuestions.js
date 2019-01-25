import { Mongo } from 'meteor/mongo';

const UserQuestions = new Mongo.Collection("userQuestions");

export default UserQuestions;