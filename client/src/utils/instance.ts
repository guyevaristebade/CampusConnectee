import axios, {AxiosInstance} from 'axios';

export const instance : AxiosInstance = axios.create({
    // baseURL : process.env.REACT_APP_BASEURL_HTPPS || process.env.REACT_APP_BASEURL_LOCAL,
    baseURL : "http://localhost:2024/api",
    withCredentials : true
})