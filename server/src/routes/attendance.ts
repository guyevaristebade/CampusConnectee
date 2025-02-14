import express, { Router, Request, Response } from 'express'
import { ResponseType } from '../types'
import {
    fetchDailyAttendance,
    getAttendancesByRangeDate,
    getStatistics,
    getTotalStudentHoursPerWeek,
    registerStudentArrival,
    registerStudentDeparture,
} from '../controllers'
import { io } from '..'
import { timeRestriction } from '../middlewares'

export const FeeRouter: Router = express.Router()

// Route pour enregistrer une arrivée
FeeRouter.post('/arrival', async (req: Request, res: Response) => {
    const response: ResponseType = await registerStudentArrival(req.body)
    res.status(response.status as number).send(response)
    if (response.success) {
        io.emit('new-arrival', response.data)
    }
})

// Route pour enregistrer un départ
FeeRouter.put('/departure', async (req: Request, res: Response) => {
    const response: ResponseType = await registerStudentDeparture(req.body)
    res.status(response.status as number).send(response)
    if (response.success) {
        io.emit('new-departure', response.data)
    }
})

// total d'heure par semaine par étudiant
// cette route sera utilisé pour restituer tous les étudiants et le total de leurs heures pour la semaine en cours
FeeRouter.get(
    '/student/total_hours_per_week',
    async (req: Request, res: Response) => {
        const response: ResponseType = await getTotalStudentHoursPerWeek()
        console.log("c'est ici")
        res.status(response.status as number).send(response)
    }
)

// Route pour les émargements de la journée en cours
FeeRouter.get('/current_day', async (req: Request, res: Response) => {
    const response: ResponseType = await fetchDailyAttendance()
    res.status(response.status as number).send(response)
})

FeeRouter.post('/range_date', async (req: Request, res: Response) => {
    const response: ResponseType = await getAttendancesByRangeDate(req.body)
    res.status(response.status as number).send(response)
})

FeeRouter.get('/statistics', async (req: Request, res: Response) => {
    // Appel à la fonction de calcul des statistiques
    const response: ResponseType = await getStatistics()
    res.status(response.status as number).send(response)
})
