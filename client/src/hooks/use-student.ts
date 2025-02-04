import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent, deleteStudentById, fetchAllStudents } from '../api'
import { message } from 'antd'

export const useStudent = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchAllStudents,
  })
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStudent,
    onSuccess: (data: any) => {
      if (data.success) {
        message.success(data.msg)
        queryClient.invalidateQueries({ queryKey: ['students'] })
      } else {
        message.error(data.msg)
      }
    },
    onError: (error) => {
      message.error("Erreur lors de l'ajout de l'étudiant")
    },
  })
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStudentById(id),
    onSuccess: (data: any) => {
      if (data.success) {
        message.success(data.msg)
        queryClient.invalidateQueries({ queryKey: ['students'] })
      } else {
        message.error(data.msg)
      }
    },
    onError: (error) => {
      message.error("Erreur lors de la suppression de l'étudiant")
    },
  })
}
