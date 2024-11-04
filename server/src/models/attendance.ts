import { Schema, model } from 'mongoose';
import {getDate} from "../utils";

const AttendanceSchema : Schema = new Schema({
    student_id:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    today_date: {
        type: String,
        default: getDate()
    },
    arrival_time :{
        type: String,
        default : "00:00"
    },
    departure_time :{
        type: String,
    },
    total_hours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed'],
        default: 'in_progress'
    },
    is_registered: {
        type: Boolean,
        default: false
    }
})

AttendanceSchema.set('timestamps', true)

export const Attendance = model('Attendance', AttendanceSchema);
