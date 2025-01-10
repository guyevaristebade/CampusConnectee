import { Schema, model } from 'mongoose'

const FileSchema: Schema = new Schema({
    url: {
        type: String,
    },
})

FileSchema.set('timestamps', true)

export const File = model('File', FileSchema)
