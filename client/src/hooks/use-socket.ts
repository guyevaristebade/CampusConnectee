// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
    const [newArrival, setNewArrival] = useState(null);
    const [newDeparture, setNewDeparture] = useState(null);

    useEffect(() => {
        // Connexion au serveur Socket.IO
        const socket = io('http://localhost:2024'); // Remplace par l'URL de ton serveur

        // Ecoute l'événement d'arrivée d'étudiant
        socket.on('student_arrival', (data) => {
            setNewArrival(data); // Met à jour l'état avec les données de l'arrivée
        });

        // Ecoute l'événement de départ d'étudiant
        socket.on('student_departure', (data) => {
            setNewDeparture(data); // Met à jour l'état avec les données du départ
        });

        // Cleanup au déchargement du composant
        return () => {
            socket.disconnect();
        };
    }, []);

    return { newArrival, newDeparture };
};
