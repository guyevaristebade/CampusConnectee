import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export const useLogin = (CHangeStateValue?: (data: any) => void) => {
  // CHangeStateValue est une fonction qui sera appelée après la connexion pour modifier la valeur user qui représente l'utilisateur connecté dans le contexte
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (CHangeStateValue) {
        CHangeStateValue(data)
        queryClient.invalidateQueries({ queryKey: ['isLoggedIn'] })
        navigate('/') // Rediriger vers la page d'accueil
      }
    },
    onError: (error: any) => {
      console.error(
        'Erreur de connexion :',
        error.response?.data?.message || 'Une erreur est survenue'
      )
    },
  })
}
