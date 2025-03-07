import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { IChildren } from '../types'
import { useLocation } from '../hooks'

export const LocationGuard = ({ children }: IChildren) => {
    const { isInCampus } = useLocation()
    const [shouldRedirect, setShouldRedirect] = useState(false)

    useEffect(() => {
        console.log('isInCampus = ', isInCampus)
        if (!isInCampus) {
            setShouldRedirect(true)
        }
    }, [isInCampus])

    if (shouldRedirect) {
        return <Navigate to="/not-authorized" />
    }

    return <>{children}</>
}
