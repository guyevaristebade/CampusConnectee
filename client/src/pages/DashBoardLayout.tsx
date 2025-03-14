import React, { useState, useEffect, useMemo } from 'react'
import { socket } from '../utils'
import {
    AttendanceChart,
    EditArrivalTimeModal,
    EditStudentModal,
    HeadBanner,
    Sidebar,
} from '../components'
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteFilled,
    EditOutlined,
} from '@ant-design/icons'
import { exportToExcel } from '../utils'
import { IStudent, IStudentData, IStudentType } from '../types'
import { DataTable, StudentList } from '../components'
import {
    Layout,
    Button,
    Typography,
    Row,
    Col,
    Tag,
    Statistic,
    Form,
    Input,
    TabsProps,
    Table,
    Tabs,
    notification,
    Spin,
    Result,
    Popconfirm,
    Tooltip,
} from 'antd'
import {
    fetchStatistics,
    useChartData,
    useDeleteDailyAttendance,
    useTotalStudentHoursPerWeek,
} from '../api'
import { useQuery } from '@tanstack/react-query'
import {
    useCreateStudent,
    useDailyAttendance,
    useDeleteStudent,
    useStudent,
} from '../hooks'
import { Outlet } from 'react-router-dom'

const { Content } = Layout
const { Title } = Typography

export const DashBoardLayout: React.FC = () => {
    const [form] = Form.useForm()
    // const [selectedMenuKey, setSelectedMenuKey] = useState<string>('dashboard')
    // const [isModalVisible, setIsModalVisible] = useState(false)
    // const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(
    //     null
    // )
    // const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    // const [selectedAttendance, setSelectedAttendance] = useState<any>(null)

    // const [search, setSearch] = useState<string>('')
    // const [api, contextHolder] = notification.useNotification()

    // const {
    //     data: dailyAttendance,
    //     isLoading: dailyAttendanceLoading,
    //     error: dailyAttendanceError,
    // } = useDailyAttendance()

    // const {
    //     data: students,
    //     error: studentsError,
    //     isLoading: studentsLoading,
    // } = useStudent()

    // const {
    //     data: statistics,
    //     error: statisticsError,
    //     isLoading: statisticsLoading,
    // } = useQuery({ queryKey: ['statistics'], queryFn: fetchStatistics })

    // const {
    //     data: attendancePerWeek,
    //     error: attendancePerWeekError,
    //     isLoading: attendancePerWeekLoading,
    // } = useTotalStudentHoursPerWeek()

    // const { data: chartData, isLoading: chartDataLoading } = useChartData()

    // const { mutate: addStudentMutation } = useCreateStudent()

    // const { mutate: deleteStudentMutation } = useDeleteStudent()

    // const { mutate: deleteAttendanceMutation } = useDeleteDailyAttendance()

    // if (studentsError) {
    //     api['error']({
    //         message: "Notification d'erreur",
    //         description: 'Fichier téléchargé avec succès',
    //         showProgress: true,
    //         duration: 5,
    //         icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    //     })
    // }

    // const onAddStudent = () => {
    //     const studentData: IStudentData = form.getFieldsValue()
    //     addStudentMutation(studentData, {
    //         onSuccess: () => {
    //             form.resetFields()
    //         },
    //     })
    // }

    // const onSearchChange = (e: any) => {
    //     setSearch(e.target.value)
    // }

    // const filteredStudents = useMemo(() => {
    //     return Array.isArray(students)
    //         ? students.filter(
    //               (student) =>
    //                   student.first_name
    //                       .toLowerCase()
    //                       .includes(search.toLowerCase()) ||
    //                   student.last_name
    //                       .toLowerCase()
    //                       .includes(search.toLowerCase())
    //           )
    //         : []
    // }, [students, search])

    // const onMenuClick = (e: any) => {
    //     const newKey = e.key
    //     localStorage.setItem('selectedMenuKey', newKey)
    //     setSelectedMenuKey(newKey)
    // }

    // const onDeleteStudent = (id: string) => {
    //     deleteStudentMutation(id)
    //     setSearch('')
    // }

    // const onEditStudent = (id: string) => {
    //     const newStudent: IStudent | null = Array.isArray(students)
    //         ? students.find((s) => s._id === id)
    //         : null
    //     setSelectedStudent(newStudent)
    //     setIsModalVisible(true)
    // }

    // const onEditAttendance = (record: any) => {
    //     setSelectedAttendance(record)
    //     setIsEditModalVisible(true)
    // }

    // const handleDownloadXLSX = (data: any[], title: string) => {
    //     const xlsx = exportToExcel(data, title)
    //     if (xlsx) {
    //         api['success']({
    //             message: 'Notification de téléchargement',
    //             description: 'Fichier téléchargé avec succès',
    //             showProgress: true,
    //             duration: 5,
    //             icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    //         })
    //     } else {
    //         api['error']({
    //             message: 'Notification de téléchargement',
    //             description: 'Fichier téléchargé avec succès',
    //             showProgress: true,
    //             duration: 5,
    //             icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    //         })
    //     }
    // }

    // const handleRetry = () => {
    //     window.location.reload()
    // }

    // const handleDeleteDailyAttendance = (id: string) => {
    //     deleteAttendanceMutation(id, {
    //         onSuccess: () => {
    //             api['success']({
    //                 message: 'Notification de suppression',
    //                 description: 'Émargement supprimé avec succès',
    //                 showProgress: true,
    //                 duration: 5,
    //                 icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    //             })
    //         },
    //         onError: () => {
    //             api['error']({
    //                 message: 'Notification de suppression',
    //                 description:
    //                     "Une erreur s'est produite lors de la suppression",
    //                 showProgress: true,
    //                 duration: 5,
    //                 icon: <CheckCircleOutlined style={{ color: 'red' }} />,
    //             })
    //         },
    //     })
    // }

    // const dailyAttendanceColumns = [
    //     {
    //         title: 'Nom',
    //         dataIndex: 'last_name',
    //         key: 'last_name',
    //         align: 'center',
    //         className: 'text-center',
    //     },
    //     {
    //         title: 'Prénom',
    //         dataIndex: 'first_name',
    //         key: 'first_name',
    //         align: 'center',
    //         className: 'text-center',
    //     },
    //     {
    //         title: "Heure d'arrivée",
    //         dataIndex: 'arrival_time',
    //         key: 'arrival_time',
    //         align: 'center',
    //         className: 'text-center',
    //     },
    //     {
    //         title: 'Heure de départ',
    //         dataIndex: 'departure_time',
    //         key: 'departure_time',
    //         align: 'center',
    //         className: 'text-center',
    //     },
    //     {
    //         title: "Total d'heures",
    //         dataIndex: 'total_hours',
    //         key: 'total_hours',
    //         align: 'center',
    //         className: 'text-center',
    //     },
    //     {
    //         title: 'Statut',
    //         dataIndex: 'status',
    //         key: 'status',
    //         align: 'center',
    //         className: 'text-center',
    //         render: (text: string) =>
    //             text === 'completed' ? (
    //                 <Tag color="green">Terminé</Tag>
    //             ) : (
    //                 <Tag color="orange">En cours</Tag>
    //             ),
    //     },
    //     {
    //         title: 'Action',
    //         dataIndex: 'action',
    //         key: 'delete',
    //         align: 'center',
    //         className: 'text-center',
    //         render: (_: any, record: any) => (
    //             <div>
    //                 <Popconfirm
    //                     title="Êtes-vous sûr de vouloir supprimer cet élève?"
    //                     onConfirm={() =>
    //                         handleDeleteDailyAttendance(record._id)
    //                     }
    //                     okText="Oui"
    //                     cancelText="Non"
    //                 >
    //                     <Button
    //                         type="default"
    //                         className="bg-red-600 text-white cursor-pointer"
    //                         icon={<DeleteFilled />}
    //                     />
    //                 </Popconfirm>

    //                 <Button
    //                     type="default"
    //                     className="bg-blue-600 text-white cursor-pointer ml-2"
    //                     icon={<EditOutlined />}
    //                     onClick={() => onEditAttendance(record)}
    //                 />
    //             </div>
    //         ),
    //     },
    // ]

    // const weeklyAttendanceColumns = [
    //     {
    //         title: 'Nom',
    //         dataIndex: 'last_name',
    //         key: 'last_name_2',
    //         align: 'center',
    //         className: 'text-center',
    //     },
    //     {
    //         title: 'Prénom',
    //         dataIndex: 'first_name',
    //         key: 'first_name_2',
    //         align: 'center',
    //         className: 'text-center',
    //     },
    //     {
    //         title: "Total d'heure",
    //         dataIndex: 'total_hours',
    //         align: 'center',
    //         key: 'total_hours_2',
    //         className: 'text-center',
    //         render: (value: number) => {
    //             const color = value < 12 ? 'red' : 'green'
    //             return (
    //                 <Tag color={color} className="w-[50px] text-center">
    //                     {value}
    //                 </Tag>
    //             )
    //         },
    //     },
    // ]

    // const studentColumns = [
    //     { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
    //     { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
    //     {
    //         title: 'Action',
    //         dataIndex: 'action',
    //         key: 'action',
    //         render: (_: any, record: IStudent) => (
    //             <Button
    //                 type="default"
    //                 className="bg-red-600 text-white cursor-pointer"
    //                 onClick={() => onDeleteStudent(record._id)}
    //             >
    //                 Supprimer
    //             </Button>
    //         ),
    //     },
    // ]

    // const items: TabsProps['items'] = [
    //     {
    //         key: 'table',
    //         label: 'Liste au format carte ',
    //         children: (
    //             <StudentList
    //                 students={
    //                     Array.isArray(filteredStudents) ? filteredStudents : []
    //                 }
    //                 handleDelete={onDeleteStudent}
    //                 handleEdit={onEditStudent}
    //             />
    //         ),
    //     },
    //     {
    //         key: 'card',
    //         label: 'Liste au format tableau',
    //         children: (
    //             <Table
    //                 columns={studentColumns}
    //                 dataSource={filteredStudents}
    //                 rowKey={'_id'}
    //                 pagination={
    //                     Array.isArray(filteredStudents)
    //                         ? filteredStudents.length > 6
    //                             ? { pageSize: 6 }
    //                             : false
    //                         : false
    //                 }
    //             />
    //         ),
    //     },
    // ]

    // useEffect(() => {
    //     const selectedMenuKey = localStorage.getItem('selectedMenuKey')
    //     if (selectedMenuKey) {
    //         setSelectedMenuKey(selectedMenuKey)
    //     }
    // }, [selectedMenuKey])

    // useEffect(() => {
    //     const handleArrival = (data: IStudentType) => {
    //         api['success']({
    //             message: "Notification d'arrivée",
    //             description: `${data.first_name} ${data.last_name} vient d'arriver au campus`,
    //             showProgress: true,
    //             icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    //         })
    //     }
    //     const handleDeparture = (data: IStudentType) => {
    //         api['success']({
    //             message: 'Notification de départ',
    //             description: `${data.first_name} ${data.last_name} Vient de partir au campus`,
    //             showProgress: true,
    //             icon: <CloseCircleOutlined style={{ color: 'green' }} />,
    //         })
    //     }

    //     socket.on('new-arrival', handleArrival)
    //     socket.on('new-departure', handleDeparture)

    //     return () => {
    //         socket.off('new-arrival', handleArrival)
    //         socket.off('new-departure', handleDeparture)
    //     }
    // }, [api])

    // if (
    //     dailyAttendanceLoading ||
    //     studentsLoading ||
    //     statisticsLoading ||
    //     attendancePerWeekLoading ||
    //     chartDataLoading
    // ) {
    //     return (
    //         <Content className=" min-h-screen flex justify-center items-center">
    //             <Spin size="large" />
    //         </Content>
    //     )
    // }

    // if (
    //     dailyAttendanceError ||
    //     studentsError ||
    //     statisticsError ||
    //     attendancePerWeekError
    // ) {
    //     return (
    //         <Content className=" min-h-screen flex justify-center items-center">
    //             <Result
    //                 title="Oups une erreur s'est produite"
    //                 extra={
    //                     <Button type="primary" onClick={handleRetry}>
    //                         Rechargez la page
    //                     </Button>
    //                 }
    //             />
    //         </Content>
    //     )
    // }

    return (
        <Layout className="min-h-screen flex">
            {/* min-h-screen => min-height : 100vh */}
            {/* {contextHolder} */}
            <Sidebar />
            <Layout className="ml-[250px] mt-[64px] h-screen overflow-hidden">
                <HeadBanner />
                <div className="flex-1 overflow-y-auto p-5 h-full">
                    <Content className="px-10 py-5">
                        <Outlet />
                    </Content>
                </div>
            </Layout>
        </Layout>
    )
}
