import React from 'react'
import { useAuth } from '../hooks'
import { UserLogin } from '../types'
import { Form, Input, Button, Typography, Row, Col, Layout } from 'antd'

const { Title } = Typography
const { Content } = Layout

export const Login: React.FC = () => {
  const { login } = useAuth()

  const onSubmit = async (values: UserLogin) => {
    await login(values)
  }

  return (
    <Content className="flex justify-center p-5 items-center bg-white">
      <Row justify="center" className="max-w-md w-full">
        <Col span={24}>
          <Title level={2} className="text-center mb-10">
            Connexion
          </Title>
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onSubmit}
            className="w-full"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer votre nom d'utilisateur!",
                },
              ]}
            >
              <Input size="large" placeholder="Guy" className="p-2.5 text-lg" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer votre mot de passe!',
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Mot de passe"
                className="p-2.5 text-lg"
              />
            </Form.Item>

            <Form.Item className="text-center mt-5">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full text-lg"
              >
                Se connecter
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  )
}
