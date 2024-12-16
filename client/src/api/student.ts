import { IStudentData, ResponseType } from "../types";
import { instance} from "../utils";


// Permet de récupérer tous les étudiants  
export const fetchAllStudents = async () : Promise<ResponseType<any>> => {
    const response = await instance.get('/student');
    return response.data.data;

}

export const fetchStudentById = async (id: number) : Promise<ResponseType<any>> => {
    const response = await instance.get(`/student/${id}`);
    return response.data;
}

export const createStudent = async (studentData: IStudentData) => {
    const response = await instance.post('/student', studentData);
    return response.data;
};


export const updateStudent = async (id: string, data: any) : Promise<ResponseType<any>> => {
    const response = await instance.put(`/student/${id}`, data);
    return response.data;
}

export const deleteStudentById = async (id: string) : Promise<ResponseType<any>> => {
        const response = await instance.delete(`/student/${id}`);
        return response.data;
}