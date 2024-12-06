/**
 * Cette fonction permet de faire la différence entre heure de départ et heure d'arrivé d'un étudiant
 * et rend le total des heures en décimal
 * */
export const  timeDifferenceInDecimal = (arrivalTime : string, departureTime : string) : string | number =>{
    // Convertir les heures au format "HH:MM" en minutes totales
    const [arrHour, arrMinute] = arrivalTime.split(':').map(Number);
    const [depHour, depMinute] = departureTime.split(':').map(Number);

    // Calculer les minutes totales depuis 00:00 pour chaque heure
    const arrivalInMinutes = arrHour * 60 + arrMinute;
    const departureInMinutes = depHour * 60 + depMinute;

    // Calculer la différence de temps en minutes
    const differenceInMinutes = departureInMinutes - arrivalInMinutes;

    // Convertir la différence en heures décimales
    return Math.round(differenceInMinutes / 60);
}
