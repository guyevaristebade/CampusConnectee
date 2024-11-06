import {IArrival, IDeparture, ResponseType } from "../types";
import { instance} from "../utils";

export const registeredArrival = async (arrivalData : IArrival) : Promise<ResponseType<any>> => {
    try {
        const response = await instance.post('/attendance/arrival', arrivalData);
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}

export const registeredDeparture = async (arrivalData : IDeparture) : Promise<ResponseType<any>> => {
    try {
        const response = await instance.put('/attendance/departure', arrivalData);
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}
