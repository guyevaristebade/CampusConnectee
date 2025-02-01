import React, { createContext, useEffect, useState } from 'react'
import { IChildren, IUserData } from '../types'
import { useIsLoggedIn } from '../hooks'

interface AuthProviderProps {
  user: IUserData | null
  setUser: React.Dispatch<React.SetStateAction<IUserData | null>>
}

export const AuthContext: React.Context<AuthProviderProps> =
  createContext<AuthProviderProps>({
    user: null,
    setUser: () => {},
  })

export const AuthContextProvider = ({ children }: IChildren) => {
  const [user, setUser] = useState<IUserData | null>(null)
  const { data } = useIsLoggedIn()

  useEffect(() => {
    if (data) {
      if (data.success && data.data?.user) {
        const user = data.data.user
        setUser(user)
      }
    }
  }, [data])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
