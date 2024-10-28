import express, { Express } from 'express';
import { connectDB } from "./utils";
import { FeeRouter, UserRouter } from "./routes";
import compression from 'compression'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app : Express = express();
const PORT = process.env.PORT || 3000;

app.use(compression())
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({
    credentials : true,
    //origin: process.env.CLIENT_URL,
    //allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/auth', UserRouter)
app.use('/api/emargement', FeeRouter)

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
