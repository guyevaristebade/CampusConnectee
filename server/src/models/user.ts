import { Schema, model } from 'mongoose';

const UserSchema : Schema = new Schema({
    username : {
        type : String,
        unique : true,
        trim : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
    },
    permissions : {
        type : String,
        enum : ['student', 'responsible'],
        default : 'student'
    }
});

UserSchema.set('timestamps', true)


export const User = model("User",UserSchema);