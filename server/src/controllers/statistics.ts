import { Attendance, Student } from "../models";
import { ResponseType } from "../types";
import { getDate } from "../utils";

export const getStatistics = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {

        const total_student = await Student.countDocuments();
        
        // Number of students present for the current day
        const dailyStudentPresent = await Attendance.countDocuments({ today_date: getDate() });

        // Calculate the daily attendance rate (as a percentage)
        const presenceRate = total_student > 0 
            ? Math.floor(((dailyStudentPresent / total_student) * 100))
            : 0;

        responsePayload.data = {
            total_student,
            daily_student: dailyStudentPresent,
            presence_rate: presenceRate
        };
    } catch (e: any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = "Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !Une erreur s'est produite, veuillez contacter les développeurs ";
    }

    return responsePayload;
};

export const getChartData = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200
    };

    try {
        const totalStudents = await Student.countDocuments();
        const dailyStudentPresent = await Attendance.countDocuments({ today_date: getDate() });

        // Pie/Doughnut Chart Data
        const presentCount = dailyStudentPresent;
        const absentCount = totalStudents - dailyStudentPresent;
        const pieChartData = {
            labels: ["Présents", "Absents"],
            datasets: [{
                data: [presentCount, absentCount],
                backgroundColor: ["#36A2EB", "#FF6384"]
            }]
        };

        // Bar Chart Data (example for daily presence)
        const barChartData = {
            labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
            datasets: [{
                label: "Présences",
                data: [12, 19, 3, 5, 2], // Example data, replace with actual data
                backgroundColor: "#36A2EB"
            }]
        };

        // Line Chart Data (example for weekly presence trend)
        const lineChartData = {
            labels: ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"],
            datasets: [{
                label: "Taux de présence",
                data: [75, 80, 85, 90], // Example data, replace with actual data
                borderColor: "#36A2EB",
                fill: false
            }]
        };

        responsePayload.data = {
            pieChartData,
            barChartData,
        };
    } catch (e: any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = "Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !Une erreur s'est produite, veuillez contacter les développeurs ";
    }

    return responsePayload;
};