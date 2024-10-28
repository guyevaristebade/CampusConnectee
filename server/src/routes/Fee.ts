import express, { Router, Request, Response } from 'express';
import { ResponseType } from "../types";
import { authenticated } from "../middlewares";
import {
    fetchAllAttendanceRecords,
    fetchAttendanceRecordsByDate, fetchAttendanceRecordsByStudentId, getTotalHoursPerWeek,
    registerStudentArrival,
    registerStudentDeparture
} from "../controllers/Fee";

export const FeeRouter: Router = express.Router();

// Route pour enregistrer une arrivée
FeeRouter.post('/arrival', authenticated, async (req: Request, res: Response) => {
    const studentId = (req as any).user.user._id;
    const response: ResponseType = await registerStudentArrival(req.body, studentId);
    res.status(response.status as number).send(response);
});


// Route pour enregistrer un départ
FeeRouter.put('/departure', authenticated, async (req: Request, res: Response) => {
    const studentId = (req as any).user.user._id;
    const response: ResponseType = await registerStudentDeparture(req.body, studentId);
    res.status(response.status as number).send(response);
});


/*
Cette partie sera débloqué si les responsable souhaite aller plus loin

//Route pour obtenir les enregistrements d'émargement pour une période spécifique
// Cette route sera utilisée pour rendre tous les enregistrements (réservé aux responsables)
FeeRouter.get('/period', authenticated, async (req: Request, res: Response) => {
    const response: ResponseType = await fetchAttendanceRecordsByDate(req.body);
    res.status(response.status as number).send(response);
});
*/

// Route pour obtenir tous les enregistrements d'émargement
FeeRouter.get('/', authenticated, async (req: Request, res: Response) => {
    const response: ResponseType = await fetchAllAttendanceRecords();
    res.status(response.status as number ).send(response);
});

//
FeeRouter.get('/total_hour_per_week', async (req: Request, res: Response) => {
    const response: ResponseType = await getTotalHoursPerWeek();
    res.status(response.status as number).send(response);
})
/*
pour aller plus loin

// route pour obtenir tous les enregistrements d'émargement d'un étudiant
FeeRouter.get('/student/:student_id', authenticated, async (req: Request, res: Response) => {
    const responsible = (req as any).user.user.permissions;
    if (responsible === 'responsible') {
        const response: ResponseType = await fetchAttendanceRecordsByStudentId(req.params.student_id);
        return res.status(response.status as number).send(response);
    }
    res.status(401).send({ success: false, msg: 'Accès non autorisé' });
});
*/
