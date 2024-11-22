import express, { Express, Request, Response, NextFunction } from 'express';
import { connectDB } from "./utils";
import { FeeRouter, StudentRouter, UserRouter } from "./routes";
import cookieParser from "cookie-parser";
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();
connectDB();

const PORT = process.env.PORT;
const app: Express = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(morgan('combined'))
}else{
    app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); 
    res.status(500).send({ success: false, message: err?.stack });
});

// Routes
app.use('/api/auth', UserRouter);
app.use('/api/attendance', FeeRouter);
app.use('/api/student', StudentRouter);




app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(process.env.NODE_ENV !== 'development')
});
