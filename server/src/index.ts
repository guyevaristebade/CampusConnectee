import express, { Express } from 'express';
import { connectDB, createStudentWithCsvFile } from "./utils";
import {FeeRouter, StudentRouter, UserRouter} from "./routes";
import compression from 'compression'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Student } from './models';

dotenv.config();


const app : Express = express();
const PORT = process.env.PORT;
const filePath = process.env.FILE_PATH as string;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []


app.use(compression())
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use('/api/auth', UserRouter)
app.use('/api/attendance', FeeRouter)
app.use('/api/student', StudentRouter)

connectDB();
// createStudentWithCsvFile(filePath)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
