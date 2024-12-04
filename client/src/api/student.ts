import { ResponseType } from "../types";
import { instance} from "../utils";


// Permet de récupérer tous les étudiants  
export const fetchAllStudent = async () : Promise<ResponseType<any>> => {
    try {
        const response = await instance.get('/student');
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}

export const fetchStudentById = async (id: number) : Promise<ResponseType<any>> => {
    try {
        const response = await instance.get(`/student/${id}`);
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}

export const createStudent = async (data: any) : Promise<ResponseType<any>> => {
    try {
        const response = await instance.post('/student', data);
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}


export const updateStudent = async (id: string, data: any) : Promise<ResponseType<any>> => {
    try {
        const response = await instance.put(`/student/${id}`, data);
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}

export const deleteStudentById = async (id: string) : Promise<ResponseType<any>> => {
    try {
        const response = await instance.delete(`/student/${id}`);
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}