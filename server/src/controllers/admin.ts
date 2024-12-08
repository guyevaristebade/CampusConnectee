import { Attendance, Student } from "../models";
import { ResponseType, IStudentData } from "../types";


export const deleteAllStudent = async () : Promise<ResponseType> =>{
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        await Student.deleteMany();
    } catch (error : any) {
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur s'est produite veuillez contactez nos développeurs"
    }

    return responsePayload;
}

export const deleteAllAttendance = async () : Promise<ResponseType> =>{
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        await Attendance.deleteMany();
    } catch (error : any) {
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur s'est produite veuillez contactez nos développeurs"
    }

    return responsePayload;
}

export const editStudent = async (id : string, student : IStudentData) : Promise<ResponseType> =>{
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const studentToUpdate = await Student.findByIdAndUpdate(id , student, {new : true});
        if(!studentToUpdate){
            responsePayload.status = 400;
            responsePayload.success = false;
            responsePayload.msg = "Une erreur s'est produite veuillez contactez nos développeurs"
        }
        responsePayload.data = studentToUpdate;
        responsePayload.msg = "Etudiant modifié avec succès"
    
    }   
    catch (error : any) {
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur s'est produite veuillez contactez nos développeurs"
    }
    return responsePayload;
}