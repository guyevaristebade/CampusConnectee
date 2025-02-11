import { useQuery } from '@tanstack/react-query'
import { instance } from '../utils'

export const getChartData = async () => {
  const response = await instance.get('/statistics/weekly-attendance')
  return response.data.data
}

export const useChartData = () => {
  return useQuery({
    queryKey: ['chart-data'],
    queryFn: getChartData,
  })
}
