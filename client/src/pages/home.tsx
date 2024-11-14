import React, { useEffect, useState } from 'react';

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
    <div className=''>
      <h2>Géolocalisation de l'utilisateur</h2>
      {location.error ? (
        <p style={{ color: 'red' }}>Erreur: {location.error}</p>
      ) : (
        <div>
          {location.latitude && location.longitude ? (
            <p>
              Latitude: {location.latitude} <br />
              Longitude: {location.longitude}
            </p>
          ) : (
            <p>Récupération de la géolocalisation en cours...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GeolocationComponent;
