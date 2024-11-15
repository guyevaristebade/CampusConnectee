import React, { useEffect, useState } from 'react';
import { Layout }  from 'antd'

const { Content } = Layout


// Définition du type pour les coordonnées géographiques
interface GeolocationData {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const GeolocationComponent: React.FC = () => {
  // État pour stocker la géolocalisation
  const [location, setLocation] = useState<GeolocationData>({
    latitude: null,
    longitude: null,
    error: null,
  });

  // Fonction pour obtenir la géolocalisation de l'utilisateur
  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mettre à jour l'état avec les coordonnées
          setLocation({
            latitude,
            longitude,
            error: null,
          });
        },
        (error) => {
          // Gérer les erreurs (par exemple, permission refusée)
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Géolocalisation non disponible",
      });
    }
  };

  // Utilisation de useEffect pour obtenir la géolocalisation lorsque le composant est monté
  useEffect(() => {
    getGeolocation();
  }, []);

  return (
    <Content className='m-5'>
      <h1 className='text-4xl font-bold'>Home Page</h1>
    </Content>
  );
};

export default GeolocationComponent;
