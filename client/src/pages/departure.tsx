import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Layout, Form, Row, Col, message, Spin, Result, Button } from 'antd'
import Confetti from 'react-confetti'
import { IDeparture, windowSizeType } from '../types'
import { fetchAllStudents, registeredDeparture } from '../api'
import { AttendanceForm, Panel } from '../components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
const { Content } = Layout

export const DeparturePage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const {
    data: students,
    error: studentsError,
    isLoading: studentsLoading,
  } = useQuery({ queryKey: ['students'], queryFn: fetchAllStudents })

  const attendanceFormMutation = useMutation({
    mutationFn: registeredDeparture,
    onSuccess: (response) => {
      if (response.success) {
        message.success('Au revoir !')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        form.resetFields()
      } else {
        message.error(response.msg)
      }
    },
    onError: (error) => {
      message.error(
        "Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !"
      )
    },
  })

  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState<windowSizeType>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const studentOptions = useMemo(
    () =>
      Array.isArray(students)
        ? students.map((student) => ({
            value: student._id,
            label: `${student.last_name.toUpperCase()} ${student.first_name.charAt(0).toUpperCase()}${student.first_name.slice(1)}`,
          }))
        : [],
    [students]
  )

  const onFinish = async (values: IDeparture) => {
    attendanceFormMutation.mutate(values)
  }

  // Fonction pour mettre à jour la taille de la fenêtre
  const handleResize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  const handleRetry = () => {
    navigate('/departure')
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  if (studentsError) {
    return (
      <Content className="flex justify-center py-10 bg-transparent">
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
  if (studentsLoading) {
    return (
      <Content className="flex justify-center py-10 bg-transparent">
        <Spin size="large" />
      </Content>
    )
  }

  return (
    <>
      <Panel />
      <Content className="flex justify-center py-10 bg-white p-5">
        {/* Affiche les confettis si showConfetti est true */}
        {showConfetti && (
          <Confetti width={windowSize.width} height={windowSize.height} />
        )}

        <Row justify="center" className="text-center max-w-md w-full">
          <Col span={24}>
            <AttendanceForm
              firstFieldName="student_id"
              buttonColor="#E1000F"
              buttonText="Départ"
              onFinish={onFinish}
              studentOptions={studentOptions}
              form={form}
            />
          </Col>
        </Row>
      </Content>
    </>
  )
}
