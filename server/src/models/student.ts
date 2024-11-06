import { Schema, model } from 'mongoose';

const StudentSchema : Schema = new Schema({
    last_name: {
        type: String,
        required: true,
    },
    first_name : {
        type: String,
        required: true,
    }
})

StudentSchema.set('timestamps', true)

export const Student = model('Student', StudentSchema);
