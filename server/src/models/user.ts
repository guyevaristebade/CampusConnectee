import { Schema, model } from 'mongoose'

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    permissions: {
        type: String,
        enum: ['Administrator', 'Responsible'],
        default: 'Responsible',
    },
})

UserSchema.set('timestamps', true)

export const User = model('User', UserSchema)
