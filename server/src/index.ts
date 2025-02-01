import express, { Express } from 'express'
import { connectDB } from './services'
import {
    FeeRouter,
    StudentRouter,
    UserRouter,
    AdminRouter,
    StatisticsRouter,
} from './routes'
import cron from 'node-cron'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http'
import { initializeSocketIO } from './services'

dotenv.config()

const PORT = process.env.PORT || 3000
const app: Express = express()
const server = http.createServer(app)

// Initialiser Socket.IO avec le serveur HTTP
export const io = initializeSocketIO(server)

// Configurer CORS
const allowedOrigins = process.env.FRONT_END_URL?.split(',') || []
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
}

// Utiliser les middlewares dans l'ordre correct
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'production') {
    app.use(compression())
    app.use(helmet())
}

// Définir les routes API
app.use('/api/auth', UserRouter)
app.use('/api/admin', AdminRouter)
app.use('/api/attendance', FeeRouter)
app.use('/api/student', StudentRouter)
app.use('/api/statistics', StatisticsRouter)

if (process.env.NODE_ENV === 'production') {
    cron.schedule('*/10 8-17 * * 1-5', () => {
        console.log(
            'Running a task every 30 minutes from 8:00 to 17:30 PM from Monday to Friday'
        )
    })
}

// Connexion à la base de données et démarrage du serveur

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
})
