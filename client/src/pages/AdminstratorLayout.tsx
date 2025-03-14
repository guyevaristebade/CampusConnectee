import { Layout } from 'antd'
import React from 'react'
import { HeadBanner, Sidebar } from '../components'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

export const AdminstratorLayout = () => {
    return (
        <Layout className="min-h-screen flex">
            <Sidebar />
            <Layout className="ml-[250px] mt-[64px] h-screen overflow-hidden">
                <HeadBanner />
                <div className="flex-1 overflow-y-auto">
                    <Content className="px-10 py-5">
                        <Outlet />
                    </Content>
                </div>
            </Layout>
        </Layout>
    )
}
