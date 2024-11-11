export const formatDate = (dateString : string) : string => {
    const date = new Date(dateString); // Créer un objet Date à partir de la chaîne de date

    const day = String(date.getDate()).padStart(2, '0');        // Jour avec zéro initial si nécessaire
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois avec zéro initial (0 = janvier)
    const year = date.getFullYear();                            // Année

    return `${day}-${month}-${year}`;                           // Retourne la date au format souhaité
};