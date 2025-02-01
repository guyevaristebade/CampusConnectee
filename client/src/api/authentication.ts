import { instance } from '../utils'
import { ResponseType, UserLogin, UserRegister } from '../types'

// login
export const login = async (
  userData: UserLogin
): Promise<ResponseType<any>> => {
  const response = await instance.post('/auth/login', userData)
  return response.data.data
}

// register
export const register = async (
  registrationData: UserRegister
): Promise<ResponseType<any>> => {
  try {
    const response = await instance.post('/auth/register', registrationData)
    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

// logout
export const logout = async (): Promise<ResponseType<any>> => {
  // try {
  const response = await instance.delete('/auth/logout')
  return response.data
  // } catch (error: any) {
  //   return error.response.data
  // }
}
