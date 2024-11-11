import express, { Router, Request, Response } from 'express';
import { ResponseType } from "../types";
// import {authenticated, verifyIp} from "../middlewares";
import {
    fetchDailyAttendance,
    getAttendanceByRangeDate,
    getStatistics,
    getTotalHoursPerWeekByStudent,
    getTotalStudentHoursPerWeek,
    registerStudentArrival,
    registerStudentDeparture
} from "../controllers";


export const FeeRouter: Router = express.Router();

// Route pour enregistrer une arrivée
FeeRouter.post('/arrival', async (req: Request, res: Response) => {
    const response: ResponseType = await registerStudentArrival(req.body);
    res.status(response.status as number).send(response);
});


// Route pour enregistrer un départ
FeeRouter.put('/departure', async (req: Request, res: Response) => {
    const response: ResponseType = await registerStudentDeparture(req.body);
    res.status(response.status as number).send(response);
});



// total d'heure par semaine par étudiant
// cette route sera utilisé pour restituer tous les étudiants et le total de leurs heures pour la semaine en cours
FeeRouter.get('/student/total_hours_per_week', async (req: Request, res: Response) => {
    const response: ResponseType = await getTotalStudentHoursPerWeek();
    res.status(response.status as number).send(response);
})


// Route pour les émargements de la journée en cours
FeeRouter.get('/current_day', async (req : Request, res: Response) => {
    const response : ResponseType = await fetchDailyAttendance();
    res.status(response.status as number).send(response)
})

FeeRouter.get('/range_date', async (req : Request, res: Response) => {
    const response : ResponseType = await getAttendanceByRangeDate(req.body);
    res.status(response.status as number).send(response)
})


FeeRouter.get('/statistics', async (req : Request, res: Response) => {
    // Appel à la fonction de calcul des statistiques
    const response : ResponseType = await getStatistics();
    res.status(response.status as number).send(response)
})
