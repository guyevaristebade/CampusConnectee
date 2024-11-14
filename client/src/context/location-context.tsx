import React, { createContext, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LATITUDE_CAMPUS = parseFloat(process.env.REACT_APP_LATITUDE_CAMPUS || '48.8575475');
const LONGITUDE_CAMPUS = parseFloat(process.env.REACT_APP_LONGITUDE_CAMPUS || '2.3513765');
const MAX_DISTANCE_METERS = 1;

interface LocationContextProps {
  isAtCampus: boolean;
  checkUserLocation: () => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in meters

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAtCampus, setIsAtCampus] = useState(false);
  const navigate = useNavigate();

  const checkUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = calculateDistance(latitude, longitude, LATITUDE_CAMPUS, LONGITUDE_CAMPUS);

          if (distance <= MAX_DISTANCE_METERS) {
            setIsAtCampus(true);
            message.success('Vous êtes à proximité du campus.');
          } else {
            setIsAtCampus(false);
            message.error('Vous n’êtes pas à proximité du campus. Accès bloqué.');
            navigate('/not-authorized');
          }
        },
        () => {
          message.error("Impossible d'obtenir votre localisation.");
          navigate('/not-authorized');
        }
      );
    } else {
      message.error("La géolocalisation n'est pas supportée par votre navigateur.");
      navigate('/not-authorized');
    }
  };

  useEffect(() => {
    checkUserLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ isAtCampus, checkUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
