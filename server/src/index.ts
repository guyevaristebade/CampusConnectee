import express, { Express } from 'express';
import { connectDB } from "./utils";
import compression from 'compression'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import {UserRouter} from "./routes";

dotenv.config();

const app : Express = express();
const PORT = process.env.PORT || 3000;

app.use(compression())
app.use(bodyParser.json());
app.use(cookieParser())

app.use(cors({
    credentials : true
}))

app.use('/api/auth', UserRouter)

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
