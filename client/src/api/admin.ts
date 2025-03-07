import { instance } from '../utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const deleteUser = async (id: string) => {
    const response = await instance.delete(`/admin/edit-user/${id}`)
    return response.data
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            })
        },
    })
}
