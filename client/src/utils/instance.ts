import axios, { AxiosInstance } from 'axios';

export const instance : AxiosInstance = axios.create({
<<<<<<< HEAD
    // baseURL : process.env.REACT_APP_BASEURL_HTPPS || process.env.REACT_APP_BASEURL_LOCAL,
    baseURL : "http://localhost:2024/api",
=======
    baseURL: process.env.REACT_APP_BASE_URL,
>>>>>>> guy
    withCredentials : true
})