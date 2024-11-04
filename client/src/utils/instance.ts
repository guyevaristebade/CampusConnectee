import axios, {AxiosInstance} from 'axios';

export const instance : AxiosInstance = axios.create({
    baseURL: 'http://localhost:2024/api',
    withCredentials : true
})
