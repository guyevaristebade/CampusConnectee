import { ResponseType } from '../types'
import { instance } from '../utils'

export const isLoggedIn = async (): Promise<ResponseType<any>> => {
  const response = await instance.get('/auth')
  return response.data
}

export const fetchAllUsers = async (): Promise<ResponseType<any>> => {
  try {
    const response = await instance.get('/auth/users')
    return response.data.data
  } catch (error: any) {
    return error.response.data
  }
}
