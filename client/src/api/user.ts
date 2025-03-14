import { useQuery } from '@tanstack/react-query'
import { ResponseType } from '../types'
import { instance } from '../utils'

export const isLoggedIn = async (): Promise<ResponseType<any>> => {
    const response = await instance.get('/auth')
    return response.data
}

export const fetchAllUsers = async (): Promise<ResponseType<any>> => {
    const response = await instance.get('/auth/users')
    return response.data
}

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUsers,
    })
}
