import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Home, Login, Unknown} from "./pages";
import {Main} from "./components";



export const AppRouter : React.FC = () =>{
    return (
        <Routes>
            <Route element={<Main/>}>
                <Route index  element={<Home/>} />
                <Route path="login"  element={<Login/>} />
            </Route>
            <Route path="*"  element={<Unknown/>} />
        </Routes>
    )
}
