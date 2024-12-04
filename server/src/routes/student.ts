import { ResponseType } from "../types";
import { authenticated } from "../middlewares";
import { Router, Request, Response } from "express";
import { createStudent, deleteAllStudent, deleteStudentById, getAllStudents, getStudentById, updateStudentById } from "../controllers";
import { IStudentData } from "../types/student";

export const StudentRouter : Router = Router();

StudentRouter.get('/', authenticated ,async (req: Request, res: Response) => {
    const response: ResponseType = await getAllStudents();
    res.status(response.status as number).send(response);
});


StudentRouter.get('/:studentId', authenticated, async (req: Request, res: Response) => {
    const id : string = req.params.studentId
    const response: ResponseType = await getStudentById(id);
    res.status(response.status as number).send(response);
});

StudentRouter.post('/',authenticated, async  (req: Request, res: Response) =>{
    const student : IStudentData = req.body
    const response : ResponseType = await createStudent(student);
    res.status(response.status as number).send(response);
})

StudentRouter.delete('/:studentId',authenticated, async  (req: Request, res: Response) =>{
    const id : string = req.params.studentId;
    const response : ResponseType = await deleteStudentById(id);
    res.status(response.status as number).send(response);
})

StudentRouter.delete('/',authenticated, async  (req: Request, res: Response) =>{
    const id : string = req.params.studentId
    const response : ResponseType = await deleteAllStudent();
    res.status(response.status as number).send(response);
})

StudentRouter.put('/:studentId',authenticated, async  (req: Request, res: Response) =>{
    const id : string = req.params.studentId
    const student : IStudentData = req.body
    const response : ResponseType = await updateStudentById(id, student);
    res.status(response.status as number).send(response);
})

