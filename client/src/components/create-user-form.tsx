import { Button, Form, FormInstance, Input, Select } from 'antd'
import React from 'react'

interface CreateUserFormProps {
    form: FormInstance
    onFinish: (values: any) => void
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
    form,
    onFinish,
}) => {
    return (
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
    )
}
