import { Response, Request, Router } from "express";
import { deleteAllAttendance, deleteAllStudent, editStudent } from "../controllers";
import { ResponseType } from "../types";

export const AdminRouter = Router();

AdminRouter.delete('/all-attendance', async (req : Request, res : Response) =>{
    const response = await deleteAllAttendance();
    return res.status(response.status as number).send(response);
});

AdminRouter.delete('/all-student', async (req : Request, res : Response) =>{
    const response = await deleteAllStudent();
    return res.status(response.status as number).send(response);
});  

AdminRouter.put('/edit-student/:id', async (req : Request, res : Response) =>{
    const { id } = req.params;
    const student = req.body;
    const response : ResponseType = await editStudent(id, student);
    return res.status(response.status as number).send(response);
})