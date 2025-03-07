import { Card, Popconfirm } from 'antd'
import React from 'react'
import { IStudent } from '../types'

type StudentCardProps = {
    student: IStudent
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export const StudentCard: React.FC<StudentCardProps> = ({
    student,
    onEdit,
    onDelete,
}) => {
    return (
        <Card className="flex flex-col justify-between bg-white rounded-lg shadow-md hover:scale-[1.02] transition-transform cursor-pointer">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{`${student.last_name} ${student.first_name}`}</h3>
                <p className="text-sm text-gray-600">ID: {student._id}</p>
            </div>
            <div className="flex space-x-3 mt-4">
                <Popconfirm
                    title="Supprimer un etudiant"
                    description="Voulez-vous vraiment supprimer cet étudiant ?"
                    okText="Oui"
                    cancelText="Non"
                    onConfirm={() => onDelete(student._id as string)}
                >
                    <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition">
                        Supprimer
                    </button>
                </Popconfirm>
                <button
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                    onClick={() => onEdit(student._id as string)}
                >
                    Modifier
                </button>
            </div>
        </Card>
    )
}
