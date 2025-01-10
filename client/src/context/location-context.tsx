import React, { createContext, useEffect, useState } from 'react'
import { IChildren } from '../types'
import { useNavigate } from 'react-router-dom'

// Définit les propriétés du contexte
interface LocationContextProps {
  isInCampus: boolean
  setIsInCampus?: (isInCampus: boolean) => void
}

// Crée le contexte
export const LocationContext = createContext<LocationContextProps>({
  isInCampus: false,
  setIsInCampus: () => {},
})

// Définit la fonction de calcul de distance
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371e3 // Rayon de la Terre en mètres
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Retourne la distance en mètres
}

// Fournit le contexte à l'application
export const LocationContextProvider = ({ children }: IChildren) => {
  const [isInCampus, setIsInCampus] = useState<boolean>(false)
  const navigate = useNavigate()

  // Coordonnées de la cible
  const targetLatitude = 48.8575475
  const targetLongitude = 2.3513765
  const radius = 100 // Rayon en mètres

  useEffect(() => {
    const checkUserLocation = () => {
      if (navigator.geolocation) {
        console.log(navigator)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            console.log('User Latitude:', latitude, 'Longitude:', longitude)

            const distance = calculateDistance(
              latitude,
              longitude,
              targetLatitude,
              targetLongitude
            )
            console.log('Distance en mètres : ', distance)

            if (distance <= radius) {
              setIsInCampus(true)
              const currentPath = window.location.pathname
              if (currentPath === '/arrival') {
                navigate('/arrival')
              } else if (currentPath === '/departure') {
                navigate('/departure')
              }
            } else {
              setIsInCampus(false)
              navigate('/not-authorized')
            }
          },
          (err) => {
            console.error('Erreur de géolocalisation :', err)
            setIsInCampus(false)
            navigate('/not-authorized')
          }
        )
      } else {
        console.error("La géolocalisation n'est pas supportée.")
        navigate('/not-authorized')
      }
    }

    checkUserLocation()
  }, [navigate, radius, targetLatitude, targetLongitude])

  return (
    <LocationContext.Provider value={{ isInCampus, setIsInCampus }}>
      {children}
    </LocationContext.Provider>
  )
}
