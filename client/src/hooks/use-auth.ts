import { AuthContext } from '../context'
import React from 'react'

export const useAuth = () => {
    return React.useContext(AuthContext)
}
