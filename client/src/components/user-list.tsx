import { Button, Table, TableColumnsType } from 'antd'
import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'

interface UserType {
    _id: string
    username: string
    permissions: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface UserListProps {
    users: any
    deleteUser: (id: string) => void
}

export const UserList: React.FC<UserListProps> = ({ users, deleteUser }) => {
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
    return <Table columns={columns} rowKey="_id" dataSource={users} />
}
