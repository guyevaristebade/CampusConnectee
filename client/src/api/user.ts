import { instance} from "../utils";

export const isLoggedIn = async () : Promise<ResponseType> => {
    try {
        const response = await instance.get('/auth');
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}
