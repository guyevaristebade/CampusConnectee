import React from 'react';
import { Route, Routes } from "react-router-dom";
import { ArrivalPage, Login, MaintenancePage, NotAuthorizedPage, ResponsiblePage, Unknown } from "./pages";
import { Main } from "./components";
import { DeparturePage } from './pages';
import { AuthContextProvider, LocationProvider } from './context';

export const AppRouter : React.FC = () =>{

    return (
        <Routes>
            <Route element={<Main/>}>
                <Route
                    path="arrival"
                    element={
                        <LocationProvider>
                            <ArrivalPage />
                        </LocationProvider>
                    }
                />
                <Route
                    path="departure"
                    element={<DeparturePage />}
                />

                <Route
                    path='login'
                    element={
                        <AuthContextProvider>
                            <Login />
                        </AuthContextProvider>
                    }
                />            
            </Route>

            <Route
                path='/'
                element={
                    <AuthContextProvider>
                        <ResponsiblePage />
                    </AuthContextProvider>
                }
            />
            
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />
            <Route path="maintenance"  element={<MaintenancePage/>} />
            <Route path="*"  element={<Unknown/>} />
        </Routes>
    )
}
