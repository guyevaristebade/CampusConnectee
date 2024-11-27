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

// Configurer CORS
const allowedOrigins = process.env.FRONT_END_URL?.split(',') || []

const corsOptions = {
    origin: allowedOrigins,
    credentials: true 
};


// Utiliser les middlewares dans l'ordre correct
app.use(cookieParser());  
app.use(cors(corsOptions)); 
app.use(bodyParser.json()); 

if (process.env.NODE_ENV === 'production') {
    app.use(compression()); 
    app.use(morgan('combined'));  
    app.use(helmet());  
} else {
    app.use(morgan('dev'));  
}

// Définition des routes API
app.use('/api/auth', UserRouter);
app.use('/api/attendance', FeeRouter);
app.use('/api/student', StudentRouter);


// Connexion à la base de données et démarrage du serveur
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});