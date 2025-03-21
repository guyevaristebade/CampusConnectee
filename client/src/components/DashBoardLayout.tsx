import React from 'react'
import { HeadBanner, Sidebar } from '../components'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

export const DashBoardLayout: React.FC = () => {
    return (
        <Layout className="min-h-screen flex">
            {/* min-h-screen => min-height : 100vh */}
            {/* {contextHolder} */}
            <Sidebar />
            <Layout className="ml-[250px] mt-[64px] h-screen overflow-hidden">
                <HeadBanner />
                <div className="flex-1 overflow-y-auto p-5 h-full">
                    <Content className="px-10 py-5">
                        <Outlet />
                    </Content>
                </div>
            </Layout>
        </Layout>
    )
}
