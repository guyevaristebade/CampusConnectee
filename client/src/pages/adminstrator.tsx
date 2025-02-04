import { Col, Form, Layout, Row, Statistic, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreateUserForm, HeadBanner, Sidebar, UserList } from '../components'
import {
  fetchAllStudents,
  fetchAllUsers,
  fetchStatistics,
  register,
} from '../api'
import { useQuery } from '@tanstack/react-query'
import { useRegister } from '../hooks/use-register'

const { Content } = Layout
const { Title } = Typography

export const Adminstrator: React.FC = () => {
  const [form] = Form.useForm()
  const { mutate: registerMutation } = useRegister(
    (data: any) => register(data),
    form
  )
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('dashboard')

  const {
    data: statistics,
    error: statisticsError,
    isLoading: statisticsLoading,
  } = useQuery({ queryKey: ['statistics'], queryFn: fetchStatistics })

  const {
    data: students,
    // error: studentsError,
    // isLoading: studentsLoading,
  } = useQuery({ queryKey: ['students'], queryFn: fetchAllStudents })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  })

  const studentColumns = [
    { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
  ]

  const onMenuClick = (e: any) => {
    const newKey = e.key
    localStorage.setItem('adminSelectedMenuKey', newKey)
    setSelectedMenuKey(newKey)
  }

  // const registerMutation = useMutation({
  //   mutationFn: register,
  //   onSuccess: (data: any) => {
  //     if (data.success) {
  //       message.success('Utilisateur créé avec succès')
  //       queryClient.invalidateQueries({
  //         queryKey: ['users'],
  //       }) // Invalider la requête 'users' pour refetcher les données

  //       form.resetFields()
  //     } else {
  //       message.error(data.msg)
  //     }
  //   },
  //   onError: (error: any) => {
  //     message.error("Erreur lors de la création de l'utilisateur")
  //   },
  // })

  const onFinish = (values: any) => {
    registerMutation(values)
  }

  useEffect(() => {
    const selectedMenuKey = localStorage.getItem('adminSelectedMenuKey')
    if (selectedMenuKey) {
      setSelectedMenuKey(selectedMenuKey)
    }
  }, [selectedMenuKey])

  return (
    <Layout className="min-h-screen flex">
      <Sidebar selectedMenuKey={selectedMenuKey} onMenuClick={onMenuClick} />
      <Layout className="flex flex-col flex-1">
        <HeadBanner />
        <div className="flex-1 overflow-y-auto">
          <Content className="px-10 py-5">
            {selectedMenuKey === 'dashboard' && (
              <div className="flex flex-col">
                <div className="mb-8">
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
                </div>

                <div>
                  <Table
                    columns={studentColumns}
                    dataSource={Array.isArray(students) ? students : []}
                    rowKey={'_id'}
                    pagination={
                      Array.isArray(students)
                        ? students.length > 6
                          ? { pageSize: 6 }
                          : false
                        : false
                    }
                  />
                </div>
              </div>
            )}

            {selectedMenuKey === 'createUser' && (
              <div>
                <Title level={3}>Créer un utilisateur</Title>
                <CreateUserForm form={form} onFinish={onFinish} />
              </div>
            )}

            {selectedMenuKey === 'userList' && (
              <div>
                <Title level={3}>Liste des utilisateurs</Title>
                <UserList users={users} />
              </div>
            )}
          </Content>
        </div>
      </Layout>
    </Layout>
  )
}
