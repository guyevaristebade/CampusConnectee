import React from 'react'
import { DataTable } from '../components'
import { Button, message, Result, Spin, Tag } from 'antd'
import { Typography } from 'antd'
import { exportToExcel } from '../utils'
import { useTotalStudentHoursPerWeek } from '../api'
import { Layout } from 'antd'

const { Content } = Layout
const { Title } = Typography

export const TotalHourPerWeekPage = () => {
    const {
        data: attendancePerWeek,
        error: attendancePerWeekError,
        isLoading: attendancePerWeekLoading,
    } = useTotalStudentHoursPerWeek()

    const weeklyAttendanceColumns = [
        {
            title: 'Nom',
            dataIndex: 'last_name',
            key: 'last_name_2',
            align: 'center',
            className: 'text-center',
        },
        {
            title: 'Prénom',
            dataIndex: 'first_name',
            key: 'first_name_2',
            align: 'center',
            className: 'text-center',
        },
        {
            title: "Total d'heure",
            dataIndex: 'total_hours',
            align: 'center',
            key: 'total_hours_2',
            className: 'text-center',
            render: (value: number) => {
                const color = value < 12 ? 'red' : 'green'
                return (
                    <Tag color={color} className="w-[50px] text-center">
                        {value}
                    </Tag>
                )
            },
        },
    ]

    const handleDownloadXLSX = (data: any[], title: string) => {
        const xlsx = exportToExcel(data, title)
        if (xlsx) {
            alert('Fichier téléchargé avec succès')
            message.success('Fichier téléchargé avec succès')
        } else {
            alert('Une erreur est survenue lors du téléchargement du fichier')
            message.error(
                'Une erreur est survenue lors du téléchargement du fichier'
            )
        }
    }

    if (attendancePerWeekError) {
        return (
            <Content>
                <Result
                    status="error"
                    title="Erreur lors du chargement des données"
                    subTitle="Veuillez réessayer plus tard"
                />
                <Button type="primary" onClick={() => window.location.reload()}>
                    Réessayer
                </Button>
            </Content>
        )
    }

    if (attendancePerWeekLoading) {
        return (
            <Content>
                <Spin size="large" />
            </Content>
        )
    }

    return (
        <div>
            <Title level={2}>
                Nombre d'heure total pour la semaine en cours
            </Title>
            <DataTable
                columns={weeklyAttendanceColumns}
                dataSource={
                    Array.isArray(attendancePerWeek) ? attendancePerWeek : []
                }
                rowKey="_id"
                onDownload={handleDownloadXLSX}
                downloadTitle={`Liste_emargement_semaine_en_course-${new Date().toISOString().split('T')[0]}`}
            />
        </div>
    )
}
