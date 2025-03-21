import React, { useState, useMemo } from 'react'
import { Layout, Form, Row, Col, message, Spin, Result, Button } from 'antd'
import Confetti from 'react-confetti'
import { IArrival, IStudentType, windowSizeType } from '../types'
import { fetchAllStudents, registeredArrival } from '../api'
import { AttendanceForm, Panel } from '../components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
const { Content } = Layout

export const ArrivalPage = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const queryClient = useQueryClient()
    const attendanceFormMutation = useMutation({
        mutationFn: registeredArrival,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] })
            setShowConfetti(true)
            message.success(response.msg, 10)
            setTimeout(() => setShowConfetti(false), 5000)
            form.resetFields()
        },
        onError: (error: any) => {
            message.error(error?.response?.data.msg, 10)
        },
    })
    const [showConfetti, setShowConfetti] = useState(false)
    const [windowSize, setWindowSize] = useState<windowSizeType>({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    const {
        data: students,
        error: studentsError,
        isLoading: studentsLoading,
    } = useQuery({ queryKey: ['students'], queryFn: fetchAllStudents })

    // Mémorise le tableau de nom d'étudiant pour éviter les rendu inutile
    const studentOptions = useMemo(
        () =>
            Array.isArray(students)
                ? students.map((student: IStudentType) => ({
                      value: student._id,
                      label: `${student.last_name.toUpperCase()} ${student.first_name.charAt(0).toUpperCase()}${student.first_name.slice(1)}`,
                  }))
                : [],
        [students]
    )

    const handleRetry = () => {
        navigate('/arrival')
    }

    // Formulaire d'entrée des informations d'arrivée
    const onFinish = (values: IArrival) => {
        attendanceFormMutation.mutate(values)
    }

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
            <Content className="flex justify-center h-screen py-10 bg-[#2c2a2a]">
                <Spin size="large" />
            </Content>
        )
    }

    return (
        <>
            <Panel />
            <Content className="flex justify-center py-10 bg-white">
                {/* Affiche les confettis si showConfetti est true */}
                {showConfetti && (
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                    />
                )}
                <Row className="text-center max-w-md w-full">
                    {/* max-w-md : max-width : 448px */}
                    <Col span={24}>
                        <AttendanceForm
                            onFinish={onFinish}
                            firstFieldName="student_id"
                            studentOptions={
                                Array.isArray(studentOptions)
                                    ? studentOptions
                                    : []
                            }
                            buttonText="Arrivé"
                            buttonColor="#000091"
                            form={form}
                        />
                    </Col>
                </Row>
            </Content>
        </>
    )
}
