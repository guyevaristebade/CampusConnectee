import { message } from 'antd'
import { IArrival, IDeparture, IRangeDateType, ResponseType } from '../types'
import { instance } from '../utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const registeredArrival = async (
    arrivalData: IArrival
): Promise<ResponseType<any>> => {
    const response = await instance.post('/attendance/arrival', arrivalData)
    return response.data
}

export const registeredDeparture = async (
    arrivalData: IDeparture
): Promise<ResponseType<any>> => {
    const response = await instance.put('/attendance/departure', arrivalData)
    return response.data
}

export const fetchDailyAttendance = async (): Promise<ResponseType<any>> => {
    const response = await instance.get('/attendance/current_day')
    return response.data.data
}

// Permet récupérer toutes les présences sur une plage de dates
// Elle prend un objet `dates` de type `IDateType` (une plage de dates) en paramètre

export const fetchStatistics = async (): Promise<ResponseType<any>> => {
    const response = await instance.get('/attendance/statistics')
    return response.data
}

export const fetchTotalSTudentHoursPerWeek = async (): Promise<
    ResponseType<any>
> => {
    const response = await instance.get(
        '/attendance/student/total_hours_per_week'
    )
    return response.data.data
}

export const fetchAllAttendanceByRangeDate = async (
    dates: IRangeDateType
): Promise<ResponseType<any>> => {
    const response = await instance.post('/attendance/range_date', dates)
    return response.data
}

export const useFetchAllAttendanceByRangeDate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: fetchAllAttendanceByRangeDate,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['AttendancesByRangeDate'],
            })
        },
        onError(error) {
            message.error(
                error?.message ||
                    'Une erreur est survenue lors de la récupération des données !'
            )
        },
    })
}

const deleteDailyAttendanceById = async (
    id: string
): Promise<ResponseType<any>> => {
    const response = await instance.delete(`/attendance/daily-attendance/${id}`)
    return response.data
}

export const useDeleteDailyAttendance = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteDailyAttendanceById,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['dailyAttendance'],
            })
        },
    })
}

const editArrivalTime = async (
    id: string,
    arrivalData: { arrival_time: string }
): Promise<ResponseType<any>> => {
    const response = await instance.put(
        `/attendance/edit-arrival-time/${id}`,
        arrivalData
    )
    return response.data
}

export const useEditArrivalTime = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            arrivalData,
        }: {
            id: string
            arrivalData: { arrival_time: string }
        }) => editArrivalTime(id, arrivalData),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['dailyAttendance'],
            })
        },
    })
}
