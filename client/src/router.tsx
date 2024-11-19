import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { ArrivalPage, Login, MaintenancePage, NotAuthorizedPage, ResponsiblePage, Unknown } from "./pages";
import { LocationGuard, Main } from "./components";
import { DeparturePage } from './pages';
import { AuthContextProvider, LocationProvider } from './context';
import GeolocationComponent from './pages/home';

export const AppRouter : React.FC = () =>{

    return (
        <Routes>
            <Route element={<Main/>}>
                <Route
                    path="arrival"
                    element={
                        <LocationProvider>
                            <LocationGuard>
                                <ArrivalPage />
                            </LocationGuard>
                        </LocationProvider>
                    }
                />
                <Route
                    path="departure"
                    element={
                        <LocationProvider>
                            <LocationGuard>
                                <DeparturePage />
                            </LocationGuard>
                        </LocationProvider>
                    }
                />
                <Route 
                    path="/"  
                    element={<GeolocationComponent />} 
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
                path='dashboard'
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
