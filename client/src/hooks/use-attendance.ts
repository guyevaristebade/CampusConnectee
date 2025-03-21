import { useQuery } from '@tanstack/react-query'
import { fetchDailyAttendance } from '../api'

export const useDailyAttendance = () => {
    return useQuery({
        queryKey: ['dailyAttendance'],
        queryFn: fetchDailyAttendance,
    })
}
