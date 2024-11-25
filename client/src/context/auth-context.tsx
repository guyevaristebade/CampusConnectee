import React, { createContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, login as loginApi, logout as logoutApi, register as registerApi } from '../api';
import { IChildren, IUserData, UserLogin } from "../types";
import { message } from "antd";



interface AuthProviderProps {
    user: IUserData | null;
    login: (userData : UserLogin) => void;
    register: (username: string, password: string, permissions : string) => void;
    logout: () => void;
}


export const AuthContext : React.Context<AuthProviderProps> = createContext<AuthProviderProps>({
    user: null,
    login: (userData : UserLogin) => {},
    register: (username: string, password: string) => {},
    logout : () => {}
});


export const AuthContextProvider =  ({ children } : IChildren) => {
    const [user, setUser] = useState<IUserData | null>(null);
    const navigate = useNavigate()

    const login = async  (userData : UserLogin) => {

        const data = await loginApi(userData)
        if(data.success){
            const user = data.data.user; 
            setUser(user);
            <Navigate to="/dashboard" />
        }else{
            message.error(data.msg)
        }
    };
    

    const register = async (username: string, password: string, permissions : string) => {
        // TODO
        
    }

    const logout = async () => {
        await logoutApi()
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        isLoggedIn()
            .then((data) => {
                if (data.success && data.data?.user) {
                    const user = data.data.user
                    setUser(user);
                    <Navigate to="/dashboard" />
                }else{
                    <Navigate to="/login" />
                }
            })
    }, [navigate]);


    return <AuthContext.Provider value={{ user, login, register, logout }}> { children } </AuthContext.Provider>;
}
