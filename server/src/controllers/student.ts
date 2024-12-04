import { isValidObjectId, sanitizeFilter } from "mongoose";
import { Student } from "../models";
import { ResponseType } from "../types";
import { IStudentData } from "../types/student";

export const getAllStudents = async () : Promise<ResponseType> => {

    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const students = await Student.find().select('-createdAt -updatedAt -__v').sort({ last_name: 1 })
        responsePayload.data = students;
    } catch (e : any)  {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur server s'est produite, veuillez contacter les développeurs"
    }

    return responsePayload;
}

export const getStudentById = async (id: string) : Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    if(!isValidObjectId(id)){
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "L'id n'est pas valide"
        return responsePayload;
    }

    try {
        const student = (await Student.findById(id).select('-createdAt -updatedAt -__v'))
        if(!student){
            responsePayload.status = 400;
            responsePayload.success = false;
            responsePayload.msg = "Utilisateur introuvable !";
            return responsePayload;
        }
        responsePayload.data = student;
    } catch (e : any)  {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur server s'est produite, veuillez contacter les développeurs"
    }

    return responsePayload;
}

export const createStudent = async (student: IStudentData) : Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    if(!student.first_name || !student.last_name){
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "Veuillez remplir les champs correctement";
        return responsePayload;
    }

    try {
        const newStudent = new Student(sanitizeFilter(student));
        await newStudent.save();
        responsePayload.data = newStudent;
        responsePayload.msg = "Etudiant crée avec succès !"

    } catch (e : any)  {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur server s'est produite, veuillez contacter les développeurs"
    }

    return responsePayload;
}

export const deleteStudentById = async (id : string) : Promise<ResponseType> =>{

    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    if(!isValidObjectId(id)){
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "L'id n'est pas valide"
        return responsePayload;
    }

    try {
        const studentTodeleted = await Student.findByIdAndDelete(id);
        
        if(!studentTodeleted){
            responsePayload.status = 400;
            responsePayload.success = false;
            responsePayload.msg = "L'id n'est pas valide"
            return responsePayload;
        }

        responsePayload.data = studentTodeleted;
        responsePayload.msg = "Etudiant supprimé avec succès";

    } catch (error : any) {
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur s'est produite veuillez contactez nos développeurs"
    }

    return responsePayload;
}

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

export const updateStudentById = async (id : string, student : IStudentData) : Promise<ResponseType> =>{
    let responsePayload : ResponseType = {
        success: true,
        status :200
    }

    try {
        const studentToUpdate = await Student.findByIdAndUpdate(id,student, {new : true})
        if(!studentToUpdate){
            responsePayload.status = 400;
            responsePayload.success = false;
            responsePayload.msg = "Une erreur s'est produite veuillez contactez nos développeurs"
        }

        responsePayload.data = studentToUpdate;
        responsePayload.msg = "Information "
    } catch (error : any) {
        responsePayload.status = 400;
        responsePayload.success = false;
        responsePayload.msg = "Une erreur s'est produite veuillez contactez nos développeurs"
    }

    return responsePayload;
}