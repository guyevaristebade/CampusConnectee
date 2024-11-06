import React from 'react';
import {Route, Routes} from "react-router-dom";
import {ArrivalPage, Login, MaintenancePage, Unknown} from "./pages";
import {Main} from "./components";
import { DeparturePage } from './pages/departure';



export const AppRouter : React.FC = () =>{
    return (
        <Routes>
            <Route element={<Main/>}>
                <Route path='arrival'  element={<ArrivalPage/>} />
                <Route path="departure"  element={<DeparturePage/>} />
                <Route index  element={<Login/>} />
            </Route>
            <Route path="maintenance"  element={<MaintenancePage/>} />
            <Route path="*"  element={<Unknown/>} />
        </Routes>
    )
}
