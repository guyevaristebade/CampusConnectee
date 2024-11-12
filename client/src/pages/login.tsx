import React from 'react';
import { Form, Input, Button, Typography, Row, Col, Layout } from 'antd';
import { useAuth } from "../hooks";
import { UserLogin } from '../types';

const { Title } = Typography;
const { Content } = Layout;



export const Login: React.FC = () => {

    const { login } = useAuth();

    const onSubmit = async (values: UserLogin) => {
        try {
            const response = await login(values)
            console.log(response);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        
            <Content className='flex justify-center p-[200px] items-center' style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                <Row justify="center" style={{ width: "100%", maxWidth: "400px" }}>
                    <Col span={24}>
                        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>Connexion</Title>
                        <Form
                            name="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onSubmit}
                            onFinishFailed={onFinishFailed}
                            style={{ maxWidth: "100%" }}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisateur!' }]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Guy"
                                    style={{ fontSize: "18px", padding: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="Mot de passe"
                                    style={{ fontSize: "18px", padding: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
                                <Button type="primary" htmlType="submit" size="large" style={{ width: "100%", fontSize: "18px" }}>
                                    Se connecter
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
    );
};

