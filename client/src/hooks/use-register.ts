import { useMutation, useQueryClient } from '@tanstack/react-query'
import { register } from '../api'
import { FormInstance, message } from 'antd'

export const useRegister = (data: any, form: FormInstance<any>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: (data: any) => {
      if (data.success) {
        message.success('Utilisateur créé avec succès')
        queryClient.invalidateQueries({
          queryKey: ['users'],
        }) // Invalider la requête 'users' pour refetcher les données

        form.resetFields()
      } else {
        message.error(data.msg)
      }
    },
    onError: (error: any) => {
      message.error("Erreur lors de la création de l'utilisateur")
    },
  })
}
