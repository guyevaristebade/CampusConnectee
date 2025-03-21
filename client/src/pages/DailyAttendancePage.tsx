import { Button, Popconfirm, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { useDeleteDailyAttendance } from '../api'
import { DataTable, EditArrivalTimeModal } from '../components'
import { useDailyAttendance } from '../hooks'
import { exportToExcel } from '../utils'
import { DeleteFilled, EditOutlined } from '@ant-design/icons'
const { Title } = Typography

export const DailyAttendancePage = () => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [selectedAttendance, setSelectedAttendance] = useState<any>(null)

    const { mutate: deleteAttendanceMutation } = useDeleteDailyAttendance()

    const { data: dailyAttendance } = useDailyAttendance()

    const handleDeleteDailyAttendance = (id: string) => {
        deleteAttendanceMutation(id, {
            onSuccess: () => {
                // api['success']({
                //     message: 'Notification de suppression',
                //     description: 'Émargement supprimé avec succès',
                //     showProgress: true,
                //     duration: 5,
                //     icon: <CheckCircleOutlined style={{ color: 'green' }} />,
                // })
            },
            onError: () => {
                // api['error']({
                //     message: 'Notification de suppression',
                //     description:
                //         "Une erreur s'est produite lors de la suppression",
                //     showProgress: true,
                //     duration: 5,
                //     icon: <CheckCircleOutlined style={{ color: 'red' }} />,
                // })
            },
        })
    }

    const onEditAttendance = (record: any) => {
        setSelectedAttendance(record)
        setIsEditModalVisible(true)
    }

    const dailyAttendanceColumns = [
        {
            title: 'Nom',
            dataIndex: 'last_name',
            key: 'last_name',
            align: 'center',
            className: 'text-center',
        },
        {
            title: 'Prénom',
            dataIndex: 'first_name',
            key: 'first_name',
            align: 'center',
            className: 'text-center',
        },
        {
            title: "Heure d'arrivée",
            dataIndex: 'arrival_time',
            key: 'arrival_time',
            align: 'center',
            className: 'text-center',
        },
        {
            title: 'Heure de départ',
            dataIndex: 'departure_time',
            key: 'departure_time',
            align: 'center',
            className: 'text-center',
        },
        {
            title: "Total d'heures",
            dataIndex: 'total_hours',
            key: 'total_hours',
            align: 'center',
            className: 'text-center',
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            className: 'text-center',
            render: (text: string) =>
                text === 'completed' ? (
                    <Tag color="green">Terminé</Tag>
                ) : (
                    <Tag color="orange">En cours</Tag>
                ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'delete',
            align: 'center',
            className: 'text-center',
            render: (_: any, record: any) => (
                <div>
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cet élève?"
                        onConfirm={() =>
                            handleDeleteDailyAttendance(record._id)
                        }
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button
                            type="default"
                            className="bg-red-600 text-white cursor-pointer"
                            icon={<DeleteFilled />}
                        />
                    </Popconfirm>

                    <Button
                        type="default"
                        className="bg-blue-600 text-white cursor-pointer ml-2"
                        icon={<EditOutlined />}
                        onClick={() => onEditAttendance(record)}
                    />
                </div>
            ),
        },
    ]

    const handleDownloadXLSX = (data: any[], title: string) => {
        const xlsx = exportToExcel(data, title)
        if (xlsx) {
            alert('Fichier téléchargé avec succès')
            // api['success']({
            //     message: 'Notification de téléchargement',
            //     description: 'Fichier téléchargé avec succès',
            //     showProgress: true,
            //     duration: 5,
            //     icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            // })
        } else {
            alert('Une erreur est survenue lors du téléchargement du fichier')
            // api['error']({
            //     message: 'Notification de téléchargement',
            //     description: 'Fichier téléchargé avec succès',
            //     showProgress: true,
            //     duration: 5,
            //     icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            // })
        }
    }

    return (
        <div>
            <Title level={2} className="mb-10">
                Émargement de la journée
            </Title>
            <DataTable
                columns={dailyAttendanceColumns}
                dataSource={
                    Array.isArray(dailyAttendance) ? dailyAttendance : []
                }
                rowKey="_id"
                onDownload={handleDownloadXLSX}
                downloadTitle={`Liste_emargement_journalier-${new Date().toISOString().split('T')[0]}`}
            />
            <EditArrivalTimeModal
                // api={api}
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                attendance={selectedAttendance}
            />
        </div>
    )
}
