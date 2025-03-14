import { Button, Input, Table, Tabs, TabsProps, Typography } from 'antd'
import React, { useMemo, useState } from 'react'
import { IStudent } from '../types'
import { useDeleteStudent, useStudent } from '../hooks'
import { EditStudentModal, StudentList } from '../components'
const { Title } = Typography

export const StudentListPage = () => {
    const [search, setSearch] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(
        null
    )
    const { mutate: deleteStudentMutation } = useDeleteStudent()
    const {
        data: students,
        error: studentsError,
        isLoading: studentsLoading,
    } = useStudent()

    const onDeleteStudent = (id: string) => {
        deleteStudentMutation(id)
        setSearch('')
    }

    const onSearchChange = (e: any) => {
        setSearch(e.target.value)
    }

    const onEditStudent = (id: string) => {
        const newStudent: IStudent | null = Array.isArray(students)
            ? students.find((s) => s._id === id)
            : null
        setSelectedStudent(newStudent)
        setIsModalVisible(true)
    }

    const studentColumns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: IStudent) => (
                <Button
                    type="default"
                    className="bg-red-600 text-white cursor-pointer"
                    onClick={() => onDeleteStudent(record._id)}
                >
                    Supprimer
                </Button>
            ),
        },
    ]

    const filteredStudents = useMemo(() => {
        return Array.isArray(students)
            ? students.filter(
                  (student) =>
                      student.first_name
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                      student.last_name
                          .toLowerCase()
                          .includes(search.toLowerCase())
              )
            : []
    }, [students, search])

    const items: TabsProps['items'] = [
        {
            key: 'table',
            label: 'Liste au format carte ',
            children: (
                <StudentList
                    students={
                        Array.isArray(filteredStudents) ? filteredStudents : []
                    }
                    handleDelete={onDeleteStudent}
                    handleEdit={onEditStudent}
                />
            ),
        },
        {
            key: 'card',
            label: 'Liste au format tableau',
            children: (
                <Table
                    columns={studentColumns}
                    dataSource={filteredStudents}
                    rowKey={'_id'}
                    pagination={
                        Array.isArray(filteredStudents)
                            ? filteredStudents.length > 6
                                ? { pageSize: 6 }
                                : false
                            : false
                    }
                />
            ),
        },
    ]

    return (
        <div>
            <Title level={2}>Liste des étudiants</Title>
            <Input
                className="my-5"
                size="large"
                placeholder="Rechercher un étudiant"
                value={search}
                onChange={onSearchChange}
            />

            <Tabs defaultActiveKey="1" items={items} />
            <EditStudentModal
                student={selectedStudent}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
            />
        </div>
    )
}
