import { useQuery } from '@tanstack/react-query'
import { fetchDailyAttendance, fetchTotalSTudentHoursPerWeek } from '../api'

export const useDailyAttendance = () => {
    return useQuery({
        queryKey: ['dailyAttendance'],
        queryFn: fetchDailyAttendance,
    })
}

// export const useTotalStudentHoursPerWeek = () => {
//     return useQuery({
//         queryKey: ['totalStudentHoursPerWeek'],
//         queryFn: fetchTotalSTudentHoursPerWeek,
//     })
// }
