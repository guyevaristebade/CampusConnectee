import React, { createContext, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

// je souhaite écrire un contexte qui vérifie si l'utilisateur est au campus ou non
// pour cela, je vais utiliser la géolocalisation de l'utilisateur 
// et comparer sa position avec celle du campus
// si l'utilisateur est à proximité du campus, il peut accéder à l'application
// sinon, il est redirigé vers une page d'erreur

// Latitude et longitude du campus
const LATITUDE_CAMPUS = parseFloat(process.env.REACT_APP_LATITUTUDE_CAMPUS as string);
const LONGITUDE_CAMPUS = parseFloat(process.env.REACT_APP_LONGITUDE_CAMPUS as string);

interface ILocationContext {
  children: React.ReactNode;
}

interface LocationContextType {
  isAtCampus: boolean;
};

// Rayon de tolérance autour du campus
const TOLERANCE_RADIUS = 0.01; // Rayon de tolérance en km

// Création du contexte
const LocationContext = createContext<LocationContextType>({
  isAtCampus: false,
});

// Hook pour accéder au contexte
export const useLocation = () => useContext(LocationContext);


// Provider du contexte
export const LocationProvider: React.FC<ILocationContext> = ({ children }) => {
  const [isAtCampus, setIsAtCampus] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkIfAtCampus = (latitude: number, longitude: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(LATITUDE_CAMPUS - latitude);
    const dLon = toRad(LONGITUDE_CAMPUS - longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(latitude)) * Math.cos(toRad(LATITUDE_CAMPUS)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    console.log(distance);
    console.log("longitude : ", longitude);
    console.log("latitude : ", latitude);

    setIsAtCampus(distance < TOLERANCE_RADIUS);
  };
  
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords;
      checkIfAtCampus(latitude, longitude);
    },
    () => {
      message.error('Impossible de récupérer votre position');
      navigate('/not-authorized');
    }
  );
  // useEffect(() => {
  //   if(!isAtCampus){
  //     navigate('/not-authorized');
  //   }
  // }, [isAtCampus,navigate]);


    return <LocationContext.Provider value={{ isAtCampus }}>{children}</LocationContext.Provider>;
};
