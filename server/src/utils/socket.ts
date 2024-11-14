import { IArrival } from '../types';
import { io } from '..';

// Créer une instance de serveur socket.io

// Fonction pour envoyer une notification d'arrivée
export const notifyArrival = (studentData: IArrival) => {
    io.emit('student_arrival', studentData); // Notifier tous les clients connectés (responsables)
};

// Fonction pour envoyer une notification de départ
export const notifyDeparture = (attendanceData: any) => {
    io.emit('student_departure', attendanceData); // Notifier tous les clients connectés (responsables)
};
