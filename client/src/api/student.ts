import { ResponseType } from "../types";
import { instance} from "../utils";

export const fetchAllStudent = async () : Promise<ResponseType<any>> => {
    try {
        const response = await instance.get('/student');
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}
