import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { useLocation } from 'react-router-dom'
interface PrivateRouteProps {
  children: React.ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth()
  let location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.permissions === 'Administrator' && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />
  }

  if (user.permissions !== 'Administrator' && location.pathname !== '/') {
    return <Navigate to="/" replace />
  }

  return <>{children}</> // 🔥 Rendre le contenu protégé !
}
