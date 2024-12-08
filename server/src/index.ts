import express, { Express } from 'express';
import { connectDB, createStudentWithXlsxFile } from "./utils";
import { FeeRouter, StudentRouter, UserRouter, AdminRouter, StatisticsRouter  } from "./routes";
import cookieParser from "cookie-parser";
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { initializeSocketIO } from './utils';  


dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();
const server = http.createServer(app);

// Initialiser Socket.IO avec le serveur HTTP
export const io = initializeSocketIO(server);

// Configurer CORS
const allowedOrigins = process.env.FRONT_END_URL?.split(',') || [];
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
} 

// Définir les routes API
app.use('/api/auth', UserRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/attendance', FeeRouter);
app.use('/api/student', StudentRouter);
app.use('/api/statistics', StatisticsRouter);


// Connexion à la base de données et démarrage du serveur
connectDB().then(() => {
    // createStudentWithXlsxFile(process.env.FILE_PATH as string);
    server.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});
