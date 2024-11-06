import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './navbar';
import { Foot } from './footer';
import { Layout } from 'antd';


export const Main : React.FC  = () =>{
    const [darkMode, setDarkMode] = useState(false);

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: darkMode ? "#1d1f21" : "#f0f2f5" }}>
            <NavBar/>
            <Outlet />
            <Foot/>
        </Layout>
    )
}
