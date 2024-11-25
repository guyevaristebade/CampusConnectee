import express, { Express } from 'express';
import { connectDB } from "./utils";
import { FeeRouter, StudentRouter, UserRouter } from "./routes";
import cookieParser from "cookie-parser";
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();


const PORT = process.env.PORT;
const app: Express = express();
const allowedOrigins = process.env.FRONT_END_URL?.split(',') || []

const corsOptions = {
    origin: allowedOrigins,
    credentials: true
}

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(morgan('combined'))
    app.use(helmet())
}else{
    app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.use('/api/auth', UserRouter);
app.use('/api/attendance', FeeRouter);
app.use('/api/student', StudentRouter);



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})

