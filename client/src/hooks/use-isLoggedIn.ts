import { useQuery } from '@tanstack/react-query'
import { isLoggedIn } from '../api'

export const useIsLoggedIn = () => {
    return useQuery({
        queryKey: ['isLoggedIn'],
        queryFn: isLoggedIn,
    })
}
