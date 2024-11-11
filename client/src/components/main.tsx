import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './navbar';
import { Foot } from './footer';
import { Layout } from 'antd';


export const Main : React.FC  = () =>{
    return (
        <Layout style={{ minHeight: "100vh", backgroundColor : "#1d1f21" }}>
            <NavBar/>
            <Outlet />
            <Foot/>
        </Layout>
    )
}
