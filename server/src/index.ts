import express, { Express } from 'express';
import { connectDB } from "./utils";
import { FeeRouter, StudentRouter, UserRouter } from "./routes";
import compression from 'compression';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
// import { Server } from 'socket.io';
// import { createServer } from 'http';

dotenv.config();

const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const app: Express = express();
// const server = createServer(app);

// // Configuration Socket.IO avec CORS
// export const io = new Server(server, {
//     cors: {
//         origin: allowedOrigins, 
//         methods: ['GET', 'POST','DELETE','PUT'],
//         credentials: true
//     },
//     transports: ['websocket', 'polling'], // WebSocket avec fallback
// });

// io.on('connection', (socket) => {
//     console.log('New client connected');
//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// Middlewares globaux
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.options('*', cors()); // Support des requêtes OPTIONS

// Routes
app.use('/api/auth', UserRouter);
app.use('/api/attendance', FeeRouter);
app.use('/api/student', StudentRouter);

// Connexion à la base de données
connectDB();

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
