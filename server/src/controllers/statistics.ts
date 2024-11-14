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
        
        // Nombre d'élèves présents pour la journée en cours
        const dailyStudentPresent = await Attendance.countDocuments({ today_date: getDate() });

        // Calcul du taux de présence journalier (en pourcentage)
        const presenceRate = total_student > 0 
            ? ((dailyStudentPresent / total_student) * 100) 
            : 0;

        responsePayload.data = {
            total_student,
            daily_student: dailyStudentPresent,
            presence_rate: presenceRate
        };
    } catch (e: any) {
        responsePayload.success = false;
        responsePayload.status = 500;
        responsePayload.msg = "Une erreur serveur s'est produite, veuillez contacter les développeurs";
    }

    return responsePayload;
};
