import React, { createContext, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LATITUDE_CAMPUS = parseFloat(process.env.REACT_APP_LATITUDE_CAMPUS || '48.8575475');
const LONGITUDE_CAMPUS = parseFloat(process.env.REACT_APP_LONGITUDE_CAMPUS || '2.3513765');
const TOLERANCE = 0.0001; // Tolérance de comparaison (en degrés)

interface LocationContextProps {
  isAtCampus: boolean;
  loading: boolean;
  checkUserLocation: () => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};

// Fonction pour vérifier si la latitude et la longitude de l'utilisateur sont similaires à celles du campus
const isAtCampusLocation = (lat: number, lon: number, campusLat: number, campusLon: number) => {
  const latitudeDifference = Math.abs(lat - campusLat);
  const longitudeDifference = Math.abs(lon - campusLon);

  // Vérifie si la différence est inférieure à la tolérance définie
  return latitudeDifference <= TOLERANCE && longitudeDifference <= TOLERANCE;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAtCampus, setIsAtCampus] = useState(false);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const checkUserLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true); // Démarre le chargement
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Vérification de la position
          if (isAtCampusLocation(latitude, longitude, LATITUDE_CAMPUS, LONGITUDE_CAMPUS)) {
            setIsAtCampus(true);
            message.success('Vous êtes à proximité du campus.');
            // navigate('/arrival')
          } else {
            setIsAtCampus(false);
            message.error('Vous n’êtes pas à proximité du campus. Accès bloqué.');
            navigate('/not-authorized');
          }

          setLoading(false); // Fin du chargement
        },
        (error) => {
          setLoading(false); // Fin du chargement même en cas d'erreur
          message.error("Impossible d'obtenir votre localisation.");
          navigate('/not-authorized');
        },
        {
          timeout: 10000, // Timeout de 10 secondes
        }
      );
    } else {
      setLoading(false); // Fin du chargement
      message.error("La géolocalisation n'est pas supportée par votre navigateur.");
      navigate('/not-authorized');
    }
  };

  useEffect(() => {
    checkUserLocation();
  }, []); // Effectué au premier rendu

  return (
    <LocationContext.Provider value={{ isAtCampus, loading, checkUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
