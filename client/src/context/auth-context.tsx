import React, {createContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useQuery} from "../hooks";
import {isLoggedIn, login as loginApi,logout as logoutApi, register as registerApi} from '../api'
import {IChildren} from "../types";



interface IUserData{
    _id?: string
    username: string;
    permissions: string
}


interface UserProviderProps {
    user: IUserData | null;
    login: (username: string, password: string) => void;
    register: (username: string, password: string, permissions : string) => void;
    logout: () => void;
}


export const AuthContext : React.Context<UserProviderProps> = createContext<UserProviderProps>({
    user: null,
    login: (username: string, password: string) => {},
    register: (username: string, password: string) => {},
    logout : () => {}
});


export const UserContextProvider =  ({children}: IChildren) => {
    const [user, setUser] = useState<IUserData | null >({_id: '3', username: 'Guy', permissions: 'Responsible'})
    const navigate = useNavigate()
    const location = useLocation()
    const query = useQuery();


    const redirect = () => {
        navigate(query.get('redirect_uri') || '/');
    }

    const login = async (username: string, password: string) => {
        const response = await loginApi(username, password);
        if(response.success) {
            setUser(response.data.user);
            redirect();
        }
        return response
    }

    const register = async (username: string, password: string, permissions : string) => {
        const response = await registerApi(username, password, permissions);
    }

    const logout = async () => {
        await logoutApi()
        setUser(null);
    };

    /*useEffect(() => {
        isLoggedIn()
            .then((data : ResponseType) => {
                if (data) {
                    console.log(data?.data.user)
                    //setUser(data);
                } else {
                    setUser(null);
                }
            })
            .catch(() => {
                setUser(null);
            });
    }, []);*/

    return <AuthContext.Provider value={{ user, login, register, logout }}> { children } </AuthContext.Provider>;
}
