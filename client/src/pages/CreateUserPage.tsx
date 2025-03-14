import { Button, Form, Input, message, Select } from 'antd'
import React from 'react'
import { useRegister } from '../api'
import { Typography } from 'antd'
const { Title } = Typography

export const CreateUserPage = () => {
    const [form] = Form.useForm()
    const { mutate: registerMutation } = useRegister()

    const onFinish = (values: any) => {
        registerMutation(values, {
            onSuccess: () => {
                form.resetFields()
                message.success('Utilisateur créé avec succès')
            },
            onError: (error: any) => {
                message.error("Une erreur s'est produite")
            },
        })
    }

    return (
        <div>
            <Title level={3}>Créer un utilisateur</Title>
            <Form
                className="mt-5"
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
                <div className="w-full flex gap-4">
                    <Form.Item label="Nom" name="username" className="w-full">
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Mot de passe"
                        name="password"
                        className="w-full"
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item
                        label="permissions"
                        name="permissions"
                        className="w-full"
                    >
                        <Select size="large">
                            <Select.Option value="Administrator">
                                Administrateur
                            </Select.Option>
                            <Select.Option value="Responsible">
                                Responsable
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">
                        Créer
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
