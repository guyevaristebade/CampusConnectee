import { instance } from '../utils'

export const getChartData = async () => {
  try {
    const response = await instance.get('/statistics/chart-data')
    return response.data
  } catch (error: any) {
    return error.response.data
  }
}
