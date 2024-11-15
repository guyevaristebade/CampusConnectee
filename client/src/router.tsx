import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { ArrivalPage, Login, MaintenancePage, NotAuthorizedPage, ResponsiblePage, Unknown } from "./pages";
import { Main } from "./components";
import { DeparturePage } from './pages';
import { AuthContextProvider, LocationProvider, useLocation } from './context';
import GeolocationComponent from './pages/home';

export const AppRouter : React.FC = () =>{

    return (
        <Routes>
            <Route element={<Main/>}>
                <Route 
                    path='arrival'  
                    element={
                        <LocationProvider>
                            <ArrivalPage/> 
                        </LocationProvider>
                    } 
                />
                <Route 
                    path="departure"  
                    element={ 
                        <LocationProvider>
                            <DeparturePage/> 
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
            <Route path="maintenance"  element={<MaintenancePage/>} />
            <Route path="*"  element={<Unknown/>} />
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />
        </Routes>
    )
}
