import { Student } from "../models";
import { ResponseType } from "../types";

export const fetchAllStudents = async () : Promise<ResponseType> => {

    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const students = (await Student.find().select('-createdAt -updatedAt -__v'))
        responsePayload.data = students;
    } catch (e : any)  {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur server s'est produite, veuillez contacter les développeurs"
    }

    return responsePayload;
}