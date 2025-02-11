import { Attendance, Student } from '../models'
import { ResponseType } from '../types'
import { getDate } from '../services'
import moment from 'moment'

export const getStatistics = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const total_student = await Student.countDocuments()

        // Number of students present for the current day
        const dailyStudentPresent = await Attendance.countDocuments({
            today_date: getDate(),
        })

        // Calculate the daily attendance rate (as a percentage)
        const presenceRate =
            total_student > 0
                ? Math.floor((dailyStudentPresent / total_student) * 100)
                : 0

        responsePayload.data = {
            total_student,
            daily_student: dailyStudentPresent,
            presence_rate: presenceRate,
        }
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg =
            "Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !Une erreur s'est produite, veuillez contacter les développeurs "
    }

    return responsePayload
}

export const getChartData = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const totalStudents = await Student.countDocuments()
        const dailyStudentPresent = await Attendance.countDocuments({
            today_date: getDate(),
        })

        // Pie/Doughnut Chart Data
        const presentCount = dailyStudentPresent
        const absentCount = totalStudents - dailyStudentPresent
        const pieChartData = {
            labels: ['Présents', 'Absents'],
            datasets: [
                {
                    data: [presentCount, absentCount],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                },
            ],
        }

        // Bar Chart Data (example for daily presence)
        const barChartData = {
            labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
            datasets: [
                {
                    label: 'Présences',
                    data: [12, 19, 3, 5, 2], // Example data, replace with actual data
                    backgroundColor: '#36A2EB',
                },
            ],
        }

        responsePayload.data = {
            pieChartData,
            barChartData,
        }
    } catch (e: any) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg =
            "Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !Une erreur s'est produite, veuillez contacter les développeurs "
    }

    return responsePayload
}

export const getAttendanceStats = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        // Définir le début et la fin de la semaine en cours
        const startOfWeek = moment().startOf('isoWeek').toDate() // Lundi
        const endOfWeek = moment().endOf('isoWeek').toDate() // Dimanche

        // Récupérer toutes les présences de la semaine
        const weeklyData = await Attendance.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek, $lte: endOfWeek },
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' }, // Grouper par jour (1 = Dimanche, 2 = Lundi, ...)
                    total: { $sum: 1 }, // Compter les présences
                },
            },
        ])

        // Convertir les jours (MongoDB commence par Dimanche = 1)
        const daysMapping: { [key: number]: string } = {
            1: 'Dimanche',
            2: 'Lundi',
            3: 'Mardi',
            4: 'Mercredi',
            5: 'Jeudi',
            6: 'Vendredi',
            7: 'Samedi',
        }

        // Normaliser les données pour s'assurer d'avoir tous les jours (même si aucune présence)
        const attendanceStats = Array.from({ length: 7 }, (_, i) => ({
            name: daysMapping[i + 1],
            count:
                weeklyData.find(
                    (d: { _id: number; total: number }) => d._id === i + 1
                )?.total || 0,
        }))

        responsePayload.data = {
            options: {
                xaxis: {
                    name: 'Jours',
                    categories: attendanceStats.map((d) => d.name),
                },
            },
            series: [
                {
                    name: 'Présences',
                    data: attendanceStats.map((d) => d.count),
                },
            ],
        }
    } catch (error) {
        responsePayload.success = false
        responsePayload.status = 500
        responsePayload.msg = "Oups ! Une erreur s'est glissée par ici..."
    }

    return responsePayload
}
