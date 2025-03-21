import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { NavBar, Footer } from './'

export const RootLayout: React.FC = () => {
    return (
        <Layout className="min-h-screen bg-white">
            <NavBar />
            <Outlet />
            <Footer />
        </Layout>
    )
}
