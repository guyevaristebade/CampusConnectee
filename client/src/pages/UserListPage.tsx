import React from 'react'
import { Button, message, Table, TableColumnsType, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useDeleteUser, useUsers } from '../api'
const { Title } = Typography

interface UserType {
    _id: string
    username: string
    permissions: string
    createdAt: string
    updatedAt: string
    __v: number
}

export const UserListPage = () => {
    const { mutate: deleteUserMutation } = useDeleteUser()
    const { data: users } = useUsers()
    const deleteUser = (id: string) => {
        deleteUserMutation(id, {
            onSuccess: () => {
                message.success('Utilisateur supprimé avec succès')
            },
            onError: () => {
                message.error(
                    "Une erreur est survenue lors de la suppression de l'utilisateur"
                )
            },
        })
    }

    const columns: TableColumnsType<UserType> = [
        {
            title: 'Name',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
            className: 'text-center',
        },
        {
            title: 'Permission',
            dataIndex: 'permissions',
            key: 'permissions',
            align: 'center',
            className: 'text-center',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            align: 'center',
            className: 'text-center',
            render: (record) => (
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => deleteUser(record._id)}
                        className="bg-red-600 text-white"
                        icon={<DeleteOutlined />}
                    />
                </div>
            ),
        },
    ]

    return (
        <div>
            <Title level={3}>Liste des utilisateurs</Title>
            <Table columns={columns} rowKey="_id" dataSource={users?.data} />
        </div>
    )
}
