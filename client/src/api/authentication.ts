import { instance } from "../utils";
import { ResponseType, UserLogin } from "../types";

// login
export const login = async (userData : UserLogin) : Promise<ResponseType<any>> => {
  try {
    const response = await instance.post('/auth/login', userData);
    return response.data;
  } catch (error : any) {
    return  error.response.data;
  }
};


// register
export const register = async (username: string, password: string, permissions : string) : Promise<ResponseType<any>> => {
    try {
      const response = await instance.post('/auth/register', {username, password, permissions});
      return response.data;
    } catch (error : any) {
      return  error.response.data;
    }
}

// logout
export const logout = async () : Promise<ResponseType<any>> =>{
    try {
      const response = await instance.delete('/auth/logout');
      return response.data;
    } catch (error : any) {
      return  error.response.data;
    }
}
