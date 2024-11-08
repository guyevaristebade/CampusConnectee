import {FeeDocument, IArrival, IDate, IDeparture, ResponseType} from "../types";
import { Attendance } from "../models";
import { getDate, timeDifferenceInDecimal, timeToDecimal } from "../utils";
import moment from "moment";

/**
 * Enregistre l'arrivée d'un étudiant.
 * Vérifie d'abord si l'étudiant est déjà enregistré pour la journée.
 * Si ce n'est pas le cas, un nouvel enregistrement est créé avec l'heure d'arrivée.
 * @param arrivalData - Données relatives à l'arrivée de l'étudiant.
 * @param studentId - ID de l'étudiant.
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées. */
export const registerStudentArrival = async (arrivalData: IArrival): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const studentArrivalRecord = await Attendance.findOne({ student_id: arrivalData.student_id, today_date: getDate() });

        if (studentArrivalRecord) {
            responsePayload.success = false;
            responsePayload.status = 400;
            responsePayload.msg = "Vous êtes déjà enregistré";
            return responsePayload;
        }

        const newArrivalRecord = new Attendance({
            student_id: arrivalData.student_id,
            arrival_time: arrivalData.arrival_time,
            total_hours: timeToDecimal(arrivalData.arrival_time),
            is_registered: true
        });

        await newArrivalRecord.save();
        responsePayload.msg = "Enregistré avec succès";
        responsePayload.data = newArrivalRecord;
    } catch (e: any) {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = e.message;
    }

    return responsePayload;
};

/**
 * Enregistre le départ d'un étudiant.
 * Calcule le temps total passé au campus à partir de l'heure d'arrivée enregistrée.
 * Vérifie si l'étudiant est encore enregistré pour la journée.
 * @param departureData - Données relatives au départ de l'étudiant.
 * @param studentId - ID de l'étudiant.
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées. */
export const registerStudentDeparture = async (departureData: IDeparture): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const attendanceRecord = await Attendance.findOne({
            student_id: departureData.student_id,
            today_date: getDate()
        });

        if(!attendanceRecord){
            responsePayload.success = false;
            responsePayload.status = 404;
            responsePayload.msg = "Vous ne pouvez pas enregistrez de départ";
            return responsePayload;
        }

        // Vérifie si l'étudiant à déjà modifié son heure de départ
        if (attendanceRecord && !attendanceRecord.is_registered) {
            responsePayload.success = false;
            responsePayload.status = 400;
            responsePayload.msg = "Vous ne pouvez plus modifier votre heure de départ";
            return responsePayload;
        }

        const durationInDecimal: string = timeDifferenceInDecimal(attendanceRecord?.arrival_time as string, departureData.departure_time);

        const updatedDepartureRecord = await Attendance.findOneAndUpdate(
            {
                student_id: departureData.student_id,
                today_date: getDate(),
            },
            {
                departure_time: departureData.departure_time,
                total_hours: durationInDecimal,
                status: "completed",
                is_registered: false
            },
            { new: true }
        );

        responsePayload.msg = "Enregistré avec succès";
        responsePayload.data = updatedDepartureRecord;
        
    } catch (e: any) {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = e.message;
    }

    return responsePayload;
};

/**
 * Récupère les enregistrements d'émargement sur une période donnée.
 * @param dateFilter - Filtre contenant la date pour laquelle les enregistrements doivent être récupérés.
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées.
 * */
export const fetchAttendanceRecordsByDate = async (dateFilter: IDate): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const attendanceRecords = await Attendance.find({ today_date: dateFilter.today_date });
        responsePayload.data = attendanceRecords;
    } catch (e: any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = e.message;
    }

    return responsePayload;
};

/**
 * Récupère tous les enregistrements d'émargement.
 *
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées.
 * */
export const fetchAllAttendanceRecords = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        //populate({ path : "student_id", select : "-password"})
        // Permet de retourner les informations de l'utilisation en enlevant le champ password
        const attendanceRecords = await Attendance.find().populate({ path : "student_id", select : "-password"}).sort({date : -1})
        responsePayload.data = attendanceRecords;
    } catch (e: any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = e.message;
    }

    return responsePayload;
};


/**
 * Récupère les enregistrements d'émargement d'un étudiant spécifique en fonction de son ID.
 * Les enregistrements sont triés par date (les plus récents en premier).
 * @param student_id - L'ID de l'étudiant dont les enregistrements d'émargement doivent être récupérés.
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées. */
export const fetchAttendanceRecordsByStudentId = async (student_id: string): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const studentAttendance = await Attendance.find({ student_id }).sort({ today_date: -1 });
        responsePayload.data = studentAttendance;
    } catch (e: any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = e.message;
    }

    return responsePayload;
}


/**
 * Récupère le total des heures travaillées par étudiant pour la semaine en cours.
 *
 * Cette fonction effectue les opérations suivantes :
 * 1. Détermine la date de début et de fin de la semaine actuelle.
 * 2. Utilise une agrégation MongoDB pour :
 *    - Filtrer les enregistrements de la collection Fee en fonction des dates de la semaine.
 *    - Grouper les résultats par identifiant d'étudiant (student_id) et calculer la somme des heures totales (`total_hours`).
 *    - Effectuer une jointure avec la collection `users` pour récupérer les détails des utilisateurs associés.
 *    - Formater le résultat pour exclure le mot de passe et ne garder que les informations pertinentes.
 *
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées.
 */
export const getTotalHoursPerWeek = async () => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {

        const startOfWeek = moment().isoWeekday(1).startOf('isoWeek').toDate(); // Lundi
        const endOfWeek = moment().isoWeekday(7).endOf('isoWeek').toDate(); // Dimanche

        const totalHoursPerWeek = await Attendance.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
                }
            },
            {
                $group: {
                    _id: "$student_id",
                    totalHours: { $sum: "$total_hours" }
                }
            },
            {
                $lookup: {
                    from: 'users', // Nom de la collection à peupler
                    localField: '_id', // Champ dans Post
                    foreignField: '_id', // Champ dans User
                    as: 'userDetails' // Nom du champ de sortie
                }
            },
            {
                $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } // Déplie les détails de l'utilisateur
            },
            {
                $project: {
                    totalHours: 1, // Garde le champ totalHours
                    userDetails: {
                        _id: 1,
                        username: 1,
                        permissions: 1,
                    }
                }
            }
        ]);
        responsePayload.data = totalHoursPerWeek;

    } catch (e: any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = e.message;
    }

    return responsePayload;
}



/**
 * Récupère les heures total par semaine pour l'étudiant connecté
 * */
export const getTotalHoursPerWeekByStudent = async (student_id : string) : Promise<ResponseType> =>{
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try{

        const startOfWeek = moment().startOf('week').toDate();
        const endOfWeek = moment().endOf('week').toDate();

        const emargement = await Attendance.find<{ student_id: string; createdAt: Date }>({
            student_id,
            createdAt: { $gte: startOfWeek, $lte: endOfWeek }
        }) as FeeDocument[];

        const totalHours = emargement.reduce((acc, curr) => acc + (curr.total_hours || 0), 0);

        responsePayload.data = {totalHoursPerWeek: totalHours};

    }catch (e : any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = e.message;
    }

    return responsePayload;
}


export const getCurrentDayAttendance = async () : Promise<ResponseType> =>{

    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };
    
    try{
        const attendances = await Attendance.find({today_date : getDate()})
        responsePayload.data = attendances
    }catch (e : any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = e.message;
    }

    return responsePayload
}
