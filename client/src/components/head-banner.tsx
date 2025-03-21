import React from 'react'
import { Button, Layout, Image } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../hooks'
import { useLogout } from '../hooks/use-logout'
const { Header } = Layout

export const HeadBanner = () => {
    const { user, setUser } = useAuth()
    const { mutate } = useLogout(() => setUser(null))

    const onLogout = () => {
        mutate()
    }

    return (
        <Header className="bg-white flex items-center justify-end fixed top-0 left-0 w-full h-16 shadow-md z-20">
            <p className="text-xl">Bonjour, {user?.username}</p>
            <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={onLogout}
                className="text-white bg-red-600 cursor-pointer mx-2"
            >
                Déconnexion
            </Button>
        </Header>
    )
}
