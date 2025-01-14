import {
    FeeDocument,
    IArrival,
    IDate,
    IDeparture,
    IRangeDateType,
    ResponseType,
} from '../types'
import { Attendance, Student } from '../models'
import { getDate, timeDifferenceInDecimal } from '../utils'
import moment from 'moment'

export const registerStudentArrival = async (
    arrivalData: IArrival
): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const studentArrivalRecord = await Attendance.findOne({
            student_id: arrivalData.student_id,
            today_date: getDate(),
        })

        if (studentArrivalRecord) {
            responsePayload.success = false
            responsePayload.status = 400
            responsePayload.msg = 'Vous êtes déjà enregistré'
            return responsePayload
        }

        const currentTime = moment().format('HH:mm')

        const newArrivalRecord = new Attendance({
            student_id: arrivalData.student_id,
            arrival_time: currentTime,
            departure_time: 'N/A',
            total_hours: 'N/A',
            is_registered: true,
            today_date: getDate(),
        })

        const student = await Student.findById(arrivalData.student_id)

        await newArrivalRecord.save()
        responsePayload.msg =
            '🎉 Vous êtes officiellement arrivé ! Félicitations, vous avez réussi à vous lever ce matin 😉'
        responsePayload.data = student
    } catch (e: any) {
        responsePayload.status = 500
        responsePayload.success = false
        responsePayload.msg =
            "Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir ! Une erreur s'est produite, veuillez contacter les développeurs " +
            e.message
    }

    return responsePayload
}

/**
 * Enregistre le départ d'un étudiant.
 * Calcule le temps total passé au campus à partir de l'heure d'arrivée enregistrée.
 * Vérifie si l'étudiant est encore enregistré pour la journée.
 * @param departureData - Données relatives au départ de l'étudiant.
 * @param studentId - ID de l'étudiant.
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées. */
export const registerStudentDeparture = async (
    departureData: IDeparture
): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const attendanceRecord = await Attendance.findOne({
            student_id: departureData.student_id,
            today_date: getDate(),
        })

        if (!attendanceRecord) {
            responsePayload.success = false
            responsePayload.status = 404
            responsePayload.msg = 'Vous ne pouvez pas enregistrez de départ'
            return responsePayload
        }

        // Vérifie si l'étudiant à déjà modifié son heure de départ
        if (attendanceRecord && !attendanceRecord.is_registered) {
            responsePayload.success = false
            responsePayload.status = 400
            responsePayload.msg =
                'Vous ne pouvez plus modifier votre heure de départ'
            return responsePayload
        }
        const currentTime = moment().format('HH:mm')

        const durationInDecimal: string | number = timeDifferenceInDecimal(
            attendanceRecord?.arrival_time as string,
            currentTime
        )

        const updatedDepartureRecord = await Attendance.findOneAndUpdate(
            {
                student_id: departureData.student_id,
                today_date: getDate(),
            },
            {
                departure_time: currentTime,
                total_hours: durationInDecimal,
                status: 'completed',
                is_registered: false,
            },
            { new: true }
        )

        const student = await Student.findById(departureData.student_id)

        responsePayload.msg = 'Enregistré avec succès'
        responsePayload.data = student
    } catch (e: any) {
        responsePayload.status = 500
        responsePayload.success = false
        responsePayload.msg = e.message
    }

    return responsePayload
}

/**
 * Récupère les enregistrements d'émargement sur une période donnée.
 * @param dateFilter - Filtre contenant la date pour laquelle les enregistrements doivent être récupérés.
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées.
 * */
export const fetchAttendanceRecordsByDate = async (
    dateFilter: IDate
): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const attendanceRecords = await Attendance.find({
            today_date: dateFilter.today_date,
        })
        responsePayload.data = attendanceRecords
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg = e.message
    }

    return responsePayload
}

/**
 * Récupère les enregistrements d'émargement d'un étudiant spécifique en fonction de son ID.
 * Les enregistrements sont triés par date (les plus récents en premier).
 * @param student_id - L'ID de l'étudiant dont les enregistrements d'émargement doivent être récupérés.
 * @returns {Promise<ResponseType>} Un objet contenant le statut de la requête et les données récupérées. */
export const fetchAttendanceRecordsByStudentId = async (
    student_id: string
): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const studentAttendance = await Attendance.find({ student_id }).sort({
            today_date: -1,
        })
        responsePayload.data = studentAttendance
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg = e.message
    }

    return responsePayload
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
export const getTotalStudentHoursPerWeek = async () => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const startOfWeek = moment().isoWeekday(1).startOf('isoWeek').toDate() // Lundi
        const endOfWeek = moment().isoWeekday(7).endOf('isoWeek').toDate() // Dimanche

        const totalHoursPerWeek = await Attendance.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek, $lte: endOfWeek }, // Filtrer les enregistrements de la semaine
                },
            },
            {
                $group: {
                    _id: '$student_id',
                    totalHours: { $sum: '$total_hours' },
                },
            },
            {
                $lookup: {
                    from: 'students', // Nom de la collection à peupler
                    localField: '_id', // Champ dans Post
                    foreignField: '_id', // Champ dans User
                    as: 'studentDetails', // Nom du champ de sortie
                },
            },
            {
                $unwind: {
                    path: '$studentDetails',
                    preserveNullAndEmptyArrays: true,
                }, // Déplie les détails de l'utilisateur
            },
            {
                $project: {
                    totalHours: 1, // Garder le total des heures
                    'studentDetails._id': 1, // Garder l'ID de l'étudiant
                    'studentDetails.first_name': 1, // Garder le prénom de l'étudiant
                    'studentDetails.last_name': 1, // Garder le nom de l'étudiant
                },
            },
            {
                $sort: { totalHours: -1 }, // Trier par totalHours dans l'ordre décroissant
            },
        ])

        const newRecord = totalHoursPerWeek.map((data) => {
            return {
                _id: data._id,
                first_name: data.studentDetails?.first_name,
                last_name: data.studentDetails?.last_name,
                total_hours: data.totalHours,
            }
        })

        responsePayload.data = newRecord
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg = e.message
    }

    return responsePayload
}

/**
 * Récupère les heures total par semaine pour l'étudiant connecté
 * */
export const getTotalHoursPerWeekByStudent = async (
    student_id: string
): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const startOfWeek = moment().startOf('week').toDate()
        const endOfWeek = moment().endOf('week').toDate()

        const emargement = (await Attendance.find<{
            student_id: string
            createdAt: Date
        }>({
            student_id,
            createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        })) as FeeDocument[]

        const totalHours = emargement.reduce(
            (acc, curr) => acc + (curr.total_hours || 0),
            0
        )

        responsePayload.data = { totalHoursPerWeek: totalHours }
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg = e.message
    }

    return responsePayload
}

/**
 * Récupère les émargements de la journée
 */
export const fetchDailyAttendance = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const attendances = await Attendance.find({ today_date: getDate() })
            .populate('student_id')
            .sort({ first_name: -1 })
        const newAttendancesTable = attendances.map((attendance: any) => {
            return {
                _id: attendance?._id,
                last_name: attendance?.student_id?.last_name,
                first_name: attendance?.student_id?.first_name,
                arrival_time: attendance?.arrival_time,
                departure_time: attendance?.departure_time,
                total_hours: attendance?.total_hours,
                status: attendance?.status,
            }
        })
        responsePayload.data = newAttendancesTable
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg = e.message
    }

    return responsePayload
}

//renvoyer des vrai date pour calculer ce qu'il y à faire
export const getAttendanceByRangeDate = async (
    dates: IRangeDateType
): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const startDate = dates.start_date
        const endDate = dates.end_date

        const attendances = await Attendance.find({
            createdAt: { $gte: startDate, $lte: endDate },
        })

        if (attendances.length == 0) {
            responsePayload.status = 404
            responsePayload.data = []
            return responsePayload
        }

        responsePayload.data = attendances
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg = e.message
    }

    return responsePayload
}
