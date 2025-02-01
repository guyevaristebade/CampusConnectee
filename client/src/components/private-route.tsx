import React from 'react'
import { useAuth } from '../hooks'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
}
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.permissions === 'Administrator') {
    return <>{children}</>
  } else {
    return <>{children}</>
  }
}
