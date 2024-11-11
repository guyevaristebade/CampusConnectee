import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {useQuery} from "../hooks";
import { isLoggedIn, login as loginApi,logout as logoutApi, register as registerApi } from '../api'
import { IChildren, IUserData } from "../types";



interface AuthProviderProps {
    user: IUserData | null;
    login: (username: string, password: string) => void;
    register: (username: string, password: string, permissions : string) => void;
    logout: () => void;
}


export const AuthContext : React.Context<AuthProviderProps> = createContext<AuthProviderProps>({
    user: null,
    login: (username: string, password: string) => {},
    register: (username: string, password: string) => {},
    logout : () => {}
});


export const AuthContextProvider =  ({ children } : IChildren) => {
    const [user, setUser] = useState<IUserData | null>(null);
    const navigate = useNavigate()
    const location = useLocation()
    const query = useQuery();


    const redirect = () => {
        navigate(query.get('redirect_uri') || '/dashboard'); // redirect to dashboard
    }


    const login = async (username: string, password: string) => {
        const response = await loginApi(username, password);
        if (response.success) {
            const user = response.data.user; 
            setUser(user);
            redirect();
        } else {
            setUser(null);
        }
        return response;
    };

    const register = async (username: string, password: string, permissions : string) => {
        // TODO
        
    }

    const logout = async () => {
        await logoutApi()
        setUser(null);
    };

    // useEffect(() => {
    //     isLoggedIn()
    //         .then((data ) => {
    //             if (data.success && data.data?.user) {
    //                 const user = data.data.user
    //                 setUser(user);
    //                 if (location.pathname === '/login') {
    //                     redirect()
    //                 }
    //             }   else if (!location.pathname.match(/^(\/|\/login)$/)) {
    //                 navigate(`/login?redirect_uri=${encodeURI(location.pathname)}`)
    //             }
    //         })
    // }, []);

    useEffect(() => {
        if (location.pathname === '/logout') {
            logout()
        }
    }, [location])

    return <AuthContext.Provider value={{ user, login, register, logout }}> { children } </AuthContext.Provider>;
}
