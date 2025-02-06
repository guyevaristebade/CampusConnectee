import React, { useState, useEffect, useMemo } from 'react'
import { socket } from '../utils'
import { EditStudentModal, HeadBanner, Sidebar } from '../components'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
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
  message,
  Form,
  Input,
  TabsProps,
  Table,
  Tabs,
  notification,
  Spin,
  Result,
} from 'antd'
import { fetchStatistics } from '../api'
import { useQuery } from '@tanstack/react-query'
import {
  useCreateStudent,
  useDailyAttendance,
  useDeleteStudent,
  useStudent,
  useTotalStudentHoursPerWeek,
} from '../hooks'

const { Content } = Layout
const { Title } = Typography

export const DashBoard: React.FC = () => {
  const [form] = Form.useForm()
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('dashboard')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null)
  const [search, setSearch] = useState<string>('')
  const [api, contextHolder] = notification.useNotification()

  const {
    data: dailyAttendance,
    isLoading: dailyAttendanceLoading,
    error: dailyAttendanceError,
  } = useDailyAttendance()

  const {
    data: students,
    error: studentsError,
    isLoading: studentsLoading,
  } = useStudent()

  const {
    data: statistics,
    error: statisticsError,
    isLoading: statisticsLoading,
  } = useQuery({ queryKey: ['statistics'], queryFn: fetchStatistics })

  const {
    data: attendancePerWeek,
    error: attendancePerWeekError,
    isLoading: attendancePerWeekLoading,
  } = useTotalStudentHoursPerWeek()

  const { mutate: addStudentMutation } = useCreateStudent()

  const { mutate: deleteStudentMutation } = useDeleteStudent()

  if (studentsError) {
    api['error']({
      message: "Notification d'erreur",
      description: 'Fichier téléchargé avec succès',
      showProgress: true,
      duration: 5,
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    })
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
      key: 'first_name_1',
      align: 'center',
      className: 'text-center',
    },
    {
      title: "Heure d'arrivée",
      dataIndex: 'arrival_time',
      key: 'arrival_time_1',
      align: 'center',
      className: 'text-center',
    },
    {
      title: 'Heure de départ',
      dataIndex: 'departure_time',
      key: 'departure_time_1',
      align: 'center',
      className: 'text-center',
    },
    {
      title: "Total d'heures",
      dataIndex: 'total_hours',
      key: 'total_hours_1',
      align: 'center',
      className: 'text-center',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status_1',
      align: 'center',
      className: 'text-center',
      render: (text: string) =>
        text === 'completed' ? (
          <Tag color="green">Terminé</Tag>
        ) : (
          <Tag color="orange">En cours</Tag>
        ),
    },
  ]

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

  const onAddStudent = () => {
    const studentData: IStudentData = form.getFieldsValue()
    addStudentMutation(studentData, {
      onSuccess: () => {
        form.resetFields()
      },
    })
  }

  const onSearchChange = (e: any) => {
    setSearch(e.target.value)
  }

  const filteredStudents = useMemo(() => {
    return Array.isArray(students)
      ? students.filter(
          (student) =>
            student.first_name.toLowerCase().includes(search.toLowerCase()) ||
            student.last_name.toLowerCase().includes(search.toLowerCase())
        )
      : []
  }, [students, search])

  const onMenuClick = (e: any) => {
    const newKey = e.key
    localStorage.setItem('selectedMenuKey', newKey)
    setSelectedMenuKey(newKey)
  }

  const onDeleteStudent = (id: string) => {
    deleteStudentMutation(id)
    setSearch('')
  }

  const onEditStudent = (id: string) => {
    const newStudent: IStudent | null = Array.isArray(students)
      ? students.find((s) => s._id === id)
      : null
    setSelectedStudent(newStudent)
    setIsModalVisible(true)
  }

  const handleDownloadXLSX = (data: any[], title: string) => {
    const xlsx = exportToExcel(data, title)
    if (xlsx) {
      api['success']({
        message: 'Notification de téléchargement',
        description: 'Fichier téléchargé avec succès',
        showProgress: true,
        duration: 5,
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      })
    } else {
      api['error']({
        message: 'Notification de téléchargement',
        description: 'Fichier téléchargé avec succès',
        showProgress: true,
        duration: 5,
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      })
    }
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const items: TabsProps['items'] = [
    {
      key: 'table',
      label: 'Liste au format carte ',
      children: (
        <StudentList
          students={Array.isArray(filteredStudents) ? filteredStudents : []}
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

  useEffect(() => {
    const selectedMenuKey = localStorage.getItem('selectedMenuKey')
    if (selectedMenuKey) {
      setSelectedMenuKey(selectedMenuKey)
    }
  }, [selectedMenuKey])

  useEffect(() => {
    const handleArrival = (data: IStudentType) => {
      api['success']({
        message: "Notification d'arrivée",
        description: `${data.first_name} ${data.last_name} vient d'arriver au campus`,
        showProgress: true,
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      })
    }
    const handleDeparture = (data: IStudentType) => {
      api['success']({
        message: 'Notification de départ',
        description: `${data.first_name} ${data.last_name} Vient de partir au campus`,
        showProgress: true,
        icon: <CloseCircleOutlined style={{ color: 'green' }} />,
      })
    }

    socket.on('new-arrival', handleArrival)
    socket.on('new-departure', handleDeparture)

    return () => {
      socket.off('new-arrival', handleArrival)
      socket.off('new-departure', handleDeparture)
    }
  }, [api])

  if (
    dailyAttendanceLoading ||
    studentsLoading ||
    statisticsLoading ||
    attendancePerWeekLoading
  ) {
    return (
      <Content className=" min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </Content>
    )
  }

  if (
    dailyAttendanceError ||
    studentsError ||
    statisticsError ||
    attendancePerWeekError
  ) {
    return (
      <Content className=" min-h-screen flex justify-center items-center">
        <Result
          title="Oups une erreur s'est produite"
          extra={
            <Button type="primary" onClick={handleRetry}>
              Rechargez la page
            </Button>
          }
        />
      </Content>
    )
  }

  return (
    <Layout className="min-h-screen flex">
      {/* min-h-screen => min-height : 100vh */}
      {contextHolder}
      <Sidebar selectedMenuKey={selectedMenuKey} onMenuClick={onMenuClick} />
      <Layout className="flex flex-col flex-1">
        <HeadBanner />
        <div className="flex-1 overflow-y-auto">
          <Content className="px-10 py-5">
            {selectedMenuKey === 'dashboard' && (
              <>
                <Title className="mb-8" level={3}>
                  Dashboard
                </Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      className="bg-white p-4 rounded"
                      value={statistics?.data.total_student}
                      title="Nombre total d'élève"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      className="bg-white p-4 rounded"
                      value={statistics?.data.daily_student}
                      title="Nombre d'élève présent aujourd'hui"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      className="bg-white p-4 rounded"
                      value={statistics?.data.presence_rate}
                      suffix="%"
                      title="Taux de présence journalier"
                    />
                  </Col>
                </Row>
              </>
            )}

            {selectedMenuKey === 'dailyAttendance' && (
              <>
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
              </>
            )}

            {selectedMenuKey === 'totalHoursPerWeek' && (
              <>
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
              </>
            )}

            {selectedMenuKey === 'studentList' && (
              <>
                <Title level={2}>Liste des étudiants</Title>
                <Input
                  className="my-5"
                  size="large"
                  placeholder="Timothée"
                  value={search}
                  onChange={onSearchChange}
                />

                <Tabs defaultActiveKey="1" items={items} />
              </>
            )}

            {selectedMenuKey === 'addStudent' && (
              <>
                <Title className="mb-8" level={3}>
                  Ajouter un étudiant
                </Title>

                <Form
                  form={form}
                  layout="vertical"
                  className="grid gap-4 grid-cols-1 md:grid-cols-2"
                  onFinish={onAddStudent}
                >
                  <Form.Item
                    name="first_name"
                    label="Prénom"
                    rules={[
                      {
                        required: true,
                        message: 'Veuillez entrer le prénom',
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item
                    name="last_name"
                    label="Nom de famille"
                    rules={[
                      {
                        required: true,
                        message: 'Veuillez entrer le nom de famille',
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item className="col-span-2 flex justify-end">
                    <Button
                      className="bg-[#000091] p-6 text-white"
                      htmlType="submit"
                    >
                      Enregistrer
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
            <EditStudentModal
              student={selectedStudent}
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
            />
          </Content>
        </div>
      </Layout>
    </Layout>
  )
}
