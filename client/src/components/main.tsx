import React from 'react';
import { Outlet } from 'react-router-dom';

export const Main : React.FC  = () =>{
    return (
        <div>
            {/* TODO : mettre une navBar */}
            <Outlet />
            {/* TODO : mettre un footer */}
        </div>
    )
}
