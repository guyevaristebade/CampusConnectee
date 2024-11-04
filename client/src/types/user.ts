import { ResponseType } from "./global";

export interface IUserData{
    _id?: string
    username: string;
    permissions: string
}


export interface LoginResponseData {
    user: IUserData;
    token: string;
}

// export type LoginResponseType = ResponseType<LoginResponseData>;
