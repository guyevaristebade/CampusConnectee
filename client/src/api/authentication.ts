import { instance } from "../utils";

// login
export const login = async (username: string, password: string) => {
  try {
    const response = await instance.post('/auth/login', { username , password});
    return response.data;
  } catch (error : any) {
    return  error.response.data;
  }
};


// register
export const register = async (username: string, password: string, permissions : string) : Promise<ResponseType> => {
    try {
      const response = await instance.post('/auth/register', {username, password, permissions});
      return response.data;
    } catch (error : any) {
      return  error.response.data;
    }
}

// logout
export const logout = async (): Promise<ResponseType> =>{
    try {
      const response = await instance.post('/auth/logout');
      return response.data;
    } catch (error : any) {
      return  error.response.data;
    }
}
