import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { ReactNode } from 'react'
import { useIsLoggedIn } from '../hooks/use-isLoggedIn'
import { Layout, Spin } from 'antd'

const { Content } = Layout

interface PublicRouteProps {
    children: ReactNode
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user } = useAuth()
    const { isLoading } = useIsLoggedIn()

    if (isLoading) {
        return (
            <Content className="flex justify-center items-center h-screen">
                <Spin size="large" fullscreen />
            </Content>
        )
    }

    if (user) {
        return (
            <Navigate
                to={user.permissions === 'Administrator' ? '/admin' : '/'}
            />
        )
    }

    return <>{children}</>
}
