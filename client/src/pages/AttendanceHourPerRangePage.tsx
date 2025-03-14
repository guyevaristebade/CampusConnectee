import React, { useEffect, useState } from 'react'
import { DatePicker, Table, Button, message, Result, Typography } from 'antd'
import { useFetchAllAttendanceByRangeDate } from '../api'
import { IRangeDateType } from '../types'
import { exportToExcel, formatNumber } from '../utils'
const { RangePicker } = DatePicker
const { Title } = Typography

export const AttendanceHourPerRangePage = () => {
    const [dateRange, setDateRange] = useState<IRangeDateType | null>(null)
    const [data, setData] = useState<any>([])
    const { mutate: rangeMutation, isPending } =
        useFetchAllAttendanceByRangeDate()

    const handleFetchData = (dates: any) => {
        if (!dates) {
            setData([])
            setDateRange(null)
            return
        }
        const formattedDates = {
            startDate: `${dates[0].$y}-${formatNumber(dates[0].$M + 1)}-${formatNumber(dates[0].$D)}`,
            endDate: `${dates[1].$y}-${formatNumber(dates[1].$M + 1)}-${formatNumber(dates[1].$D)}`,
        }

        setDateRange(formattedDates)
    }

    const handleDownload = (data: any) => {
        exportToExcel(data, 'Heures_de_présence_périodiques')
    }

    useEffect(() => {
        if (dateRange) {
            rangeMutation(dateRange, {
                onSuccess(data) {
                    setData(data.data)
                },
                onError(error) {
                    message.error(
                        'Une erreur est survenue lors de la récupération des données !'
                    )
                },
            })
        }
        console.log(dateRange)
    }, [dateRange, rangeMutation])

    return (
        <div className="z-0">
            <Title level={2}>Heures de présence par date</Title>

            <RangePicker
                onChange={handleFetchData}
                size="large"
                className="mb-5 mr-2.5"
            />

            {!data.length ? (
                <Result
                    status="404"
                    title="Sélectionnez une plage de dates pour afficher les données"
                />
            ) : (
                <Table
                    dataSource={data}
                    loading={!data.length}
                    rowKey="_id"
                    columns={[
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
                            title: 'Heures de présence',
                            dataIndex: 'total_hours',
                            key: 'total_hours',
                            align: 'center',
                            className: 'text-center',
                        },
                    ]}
                />
            )}
            <Button
                className="bg-[#000091] p-6 text-white"
                htmlType="submit"
                disabled={dateRange === null}
                loading={isPending}
                onClick={() => handleDownload(data)}
            >
                Télécharger
            </Button>
        </div>
    )
}
