import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api'

export const useLogout = (CallbackFn?: (data: null) => void) => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            if (CallbackFn) {
                CallbackFn(null)
                navigate('/login')
            }
        },
        onError: (error: any) => {
            console.error(
                'Erreur de déconnexion :',
                error.response?.data?.message || 'Une erreur est survenue'
            )
        },
    })
}
