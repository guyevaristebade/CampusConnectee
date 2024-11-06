import React, { useState } from 'react';
import { useAuth } from "../hooks";
import { Layout, Form,Typography, Button, Row, Col, Switch, Input } from "antd";
import { Link } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export const Home: React.FC = () => {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = (checked: boolean) => {
        setDarkMode(checked);
        document.body.style.backgroundColor = checked ? "#1d1f21" : "#f0f2f5"; // changement de couleur de fond pour le mode sombre
    };

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: darkMode ? "#1d1f21" : "#f0f2f5" }}>
            

            <Content style={{ padding: "30px 15px" }}>
                <Row justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                        <Title level={3} style={{ marginBottom: "20px", fontSize: "clamp(20px, 4vw, 28px)" }}>
                            Gérez facilement vos présences
                        </Title>
                        {/* <Paragraph style={{ fontSize: "clamp(14px, 3vw, 16px)", color: darkMode ? "#d3d3d3" : "#595959", margin: "0 auto", maxWidth: "500px" }}>
                            Une application simple et rapide pour enregistrer vos heures d'arrivée et de départ au campus.
                            Connectez-vous pour suivre vos horaires et faciliter l'administration.
                        </Paragraph>
                        <Button
                            type="primary"
                            shape="round"
                            size="large"
                            style={{ marginTop: "30px", fontSize: "clamp(14px, 2.5vw, 16px)", padding: "5px 20px" }}
                        >
                            <Link to="/login">Se connecter</Link>
                        </Button> */}
                        <Form
                            name="login"
                            // initialValues={{ remember: true }}
                            // onFinish={}
                            // onFinishFailed={onFinishFailed}
                            style={{ maxWidth: "100%" }}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisateur!' }]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Guy Bade"
                                    style={{ fontSize: "18px", padding: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="arrived_time"
                                rules={[{ required: true, message: 'Veuillez remplir ce champs' }]}
                            >
                                <Input
                                    type='time'
                                    size="large"
                                    placeholder="08:24"
                                    style={{ fontSize: "18px", padding: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
                                <Button type="primary" htmlType="submit" size="large" style={{ width: "100%", fontSize: "18px", backgroundColor : "green" }}>
                                   Arrivé
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};
