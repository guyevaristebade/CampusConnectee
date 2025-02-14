import { Button, Table, TableColumnsType } from 'antd'
import React from 'react'

export interface UserType {
  _id: string
  username: string
  permissions: string
  createdAt: string
  updatedAt: string
  __v: number
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
    render: () => (
      <div className="flex gap-4 justify-center">
        <Button type="primary">Edit</Button>
        <Button className="bg-red-600 text-white">Delete</Button>
      </div>
    ),
  },
]

interface UserListProps {
  users: any
}
export const UserList: React.FC<UserListProps> = ({ users }) => {
  return <Table columns={columns} rowKey="_id" dataSource={users} />
}
