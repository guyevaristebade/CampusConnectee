import React, { useState } from 'react'
import { StudentCard } from '.'
import { Pagination } from 'antd'
import { IStudent } from '../types'

interface StudentListProps {
    students: IStudent[]
    handleDelete?: (id: string) => void
    handleEdit?: (id: string) => void
}

export const StudentList: React.FC<StudentListProps> = ({
    students,
    handleDelete,
    handleEdit,
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 9

    // Calcul des étudiants affichés sur la page actuelle
    const startIndex = (currentPage - 1) * pageSize
    const currentStudents = students.slice(startIndex, startIndex + pageSize)

    return (
        <div className="p-6 bg-gray-100">
            <div className="grid grid-cols-3 gap-4">
                {currentStudents.map((student) => (
                    <StudentCard
                        key={student._id}
                        student={student}
                        onEdit={handleEdit || (() => {})}
                        onDelete={handleDelete || (() => {})}
                    />
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={students.length}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}
