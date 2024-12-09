import { IArrival, IDateType, IDeparture, ResponseType } from "../types";
import { instance } from "../utils";


export const registeredArrival = async (arrivalData: IArrival): Promise<ResponseType<any>> => {
    try {
        const response = await instance.post('/attendance/arrival', arrivalData);
        return response.data;  
    } catch (error: any) {
        return error.response.data;
    }
}



export const registeredDeparture = async (arrivalData: IDeparture): Promise<ResponseType<any>> => {
    try {
        const response = await instance.put('/attendance/departure', arrivalData);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}


export const fetchDailyAttendance = async (): Promise<ResponseType<any>> => {
    try {
        const response = await instance.get('/attendance/current_day');
        return response.data;  
    } catch (error: any) {
        return error.response.data;
    }
}

// Permet récupérer toutes les présences sur une plage de dates
// Elle prend un objet `dates` de type `IDateType` (une plage de dates) en paramètre
export const fetchAllAttendanceByRangeDate = async (dates: IDateType): Promise<ResponseType<any>> => {
    try {
        const response = await instance.get('/attendance/range_date');
        return response.data; 
    } catch (error: any) {
        return error.response.data;
    }
}


export const fetchStatistics = async () : Promise<ResponseType<any>> =>{
    try {
        const response = await instance.get('/attendance/statistics');
        return response.data; 
    } catch (error : any) {
        return error.response.data;
    }
}


export const fetchTotalSTudentHoursPerWeek = async () : Promise<ResponseType<any>> =>{
    try {
        const response = await instance.get('/attendance/student/total_hours_per_week');
        return response.data; 
    } catch (error : any) {
        return error.response.data;
    }
}

export const fetchAttendanceByRangeDate = async (dates : any) : Promise<ResponseType<any>> =>{
    try {
        const response = await instance.get('/attendance/range_date',dates);
        return response.data; 
    } catch (error : any) {
        return error.response.data;
    }
}