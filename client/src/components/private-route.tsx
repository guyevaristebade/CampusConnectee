import React, { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { useLocation } from 'react-router-dom'

export const PrivateRoute = ({ children }: PropsWithChildren) => {
    const { user } = useAuth()
    let location = useLocation()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (
        location.pathname.startsWith('/admin') &&
        user.permissions !== 'Administrator'
    ) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
