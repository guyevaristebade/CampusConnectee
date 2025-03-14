import { Attendance, Student, User } from '../models'
import { ResponseType, IStudentData, IUser } from '../types'

export const deleteAllAttendance = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        await Attendance.deleteMany()
    } catch (error: any) {
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg =
            "Une erreur s'est produite veuillez contactez nos développeurs"
    }

    return responsePayload
}

export const editStudent = async (
    id: string,
    student: IStudentData
): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const studentToUpdate = await Student.findByIdAndUpdate(id, student, {
            new: true,
        })
        if (!studentToUpdate) {
            responsePayload.status = 400
            responsePayload.success = false
            responsePayload.msg =
                "Une erreur s'est produite veuillez contactez nos développeurs"
        }
        responsePayload.data = studentToUpdate
        responsePayload.msg = 'Etudiant modifié avec succès'
    } catch (error: any) {
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg =
            "Une erreur s'est produite veuillez contactez nos développeurs"
    }
    return responsePayload
}

// export const creatUserWithFile = async (
//     filePath: string
// ): Promise<ResponseType> => {
//     let responsePayload: ResponseType = {
//         success: true,
//         status: 200,
//     }

//     try {
//         await createStudentWithXlsxFile(filePath)
//     } catch (error: any) {
//         responsePayload.status = 400
//         responsePayload.success = false
//         responsePayload.msg =
//             "Une erreur s'est produite veuillez contactez nos développeurs"
//     }

//     return responsePayload
// }

// controlleur pour supprimer tout les étudiant  deleteAllStudent
export const deleteAllStudent = async (): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        await Student.deleteMany()
    } catch (error: any) {
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg =
            "Une erreur s'est produite veuillez contactez nos développeurs"
    }
    return responsePayload
}

export const editUser = async (
    id: string,
    user: IUser
): Promise<ResponseType> => {
    let response: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const userToUpdate = await User.findByIdAndUpdate(id, user, {
            new: true,
        })

        if (!userToUpdate) {
            response.status = 400
            response.success = false
            response.msg =
                "Une erreur s'est produite veuillez contactez nos développeurs"
        }
        response.data = userToUpdate
        response.msg = 'Utilisateur modifié avec succès'
    } catch (e: any) {
        response.status = 400
        response.success = false
        response.msg =
            "Une erreur s'est produite veuillez contactez nos développeurs"
    }

    return response
}

export const deleteUser = async (id: string): Promise<ResponseType> => {
    let response: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const user = await User.findByIdAndDelete(id)

        if (!user) {
            response.status = 400
            response.success = false
            response.msg = 'Utilisateur non trouvé'
            return response
        }
        response.msg = 'Utilisateur supprimé avec succès'
    } catch (e: any) {
        response.status = 500
        response.success = false
        response.msg =
            "Une erreur s'est produite, veuillez contactez les développeurs"
    }
    return response
}
