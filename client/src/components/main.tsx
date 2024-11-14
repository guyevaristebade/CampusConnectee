import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './navbar';
import { Foot } from './footer';
import { Layout } from 'antd';


export const Main : React.FC  = () =>{
    return (
        <Layout className="min-h-screen bg-white">
            <NavBar/>
            <Outlet />
            <Foot/>
        </Layout>
    )
}
