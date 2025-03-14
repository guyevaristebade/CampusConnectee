import { Button, Form, Input, Typography } from 'antd'
import React from 'react'
import { IStudentData } from '../types'
import { useCreateStudent } from '../hooks'
import { Layout } from 'antd'
const { Title } = Typography

export const AddStudentPage = () => {
    const [form] = Form.useForm()

    const { mutate: addStudentMutation } = useCreateStudent()

    const onAddStudent = () => {
        const studentData: IStudentData = form.getFieldsValue()
        addStudentMutation(studentData, {
            onSuccess: () => {
                form.resetFields()
            },
        })
    }

    return (
        <div>
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
        </div>
    )
}
