import { ResponseType } from "../types";
import {authenticated, verifyIp} from "../middlewares";
import { Router, Request, Response } from "express";
import { fetchAllStudents } from "../controllers";

export const StudentRouter : Router = Router();

StudentRouter.get('/', async (req: Request, res: Response) => {
    const response: ResponseType = await fetchAllStudents();
    res.status(response.status as number).send(response);
});
