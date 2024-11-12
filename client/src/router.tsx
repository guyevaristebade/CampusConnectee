import React from 'react';
import {Route, Routes} from "react-router-dom";
import {ArrivalPage, Login, MaintenancePage, ResponsiblePage, Unknown} from "./pages";
import {Main, PrivateRoute} from "./components";
import { DeparturePage } from './pages/departure';
import { AuthContextProvider } from './context';



export const AppRouter : React.FC = () =>{
    return (
        <Routes>
            <Route element={<Main/>}>
                <Route path='arrival'  element={<ArrivalPage/>} />
                <Route path="departure"  element={<DeparturePage/>} />
                <Route
                    path='login'
                    element={
                        <AuthContextProvider>
                            <Login />
                        </AuthContextProvider>
                    }
                />            
            </Route>
            {/* <Route
                path='login'
                element={
                    <AuthContextProvider>
                        <Login />
                    </AuthContextProvider>
                }
            /> */}

            <Route
                path='dashboard'
                element={
                    <AuthContextProvider>
                        <ResponsiblePage />
                    </AuthContextProvider>
                }
            />
            <Route path="maintenance"  element={<MaintenancePage/>} />
            <Route path="*"  element={<Unknown/>} />
        </Routes>
    )
}
