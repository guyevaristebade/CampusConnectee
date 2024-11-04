import React from 'react';
import { useAuth } from "../hooks";
import { Layout, Typography, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export const Home: React.FC = () => {
    const { user } = useAuth();

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
            <Header style={{
                backgroundColor: "#001529",
                textAlign: "center",
                padding: "20px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Title level={1} style={{ color: "#ffffff", marginBottom: 0, fontSize: "clamp(24px, 5vw, 36px)" }}>
                    Bienvenue sur le Campus Connecté
                </Title>
            </Header>

            <Content style={{ padding: "30px 15px" }}>
                <Row justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                        <Title level={3} style={{ marginBottom: "20px", fontSize: "clamp(20px, 4vw, 28px)" }}>
                            Gérez facilement vos présences
                        </Title>
                        <Paragraph style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#595959", margin: "0 auto", maxWidth: "500px" }}>
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
                        </Button>
                    </Col>
                </Row>
            </Content>

            <Footer style={{ textAlign: "center", backgroundColor: "#001529", color: "#ffffff", padding: "10px 20px" }}>
                Campus Connecté ©2024 - Simplifiez vos présences
            </Footer>
        </Layout>
    );
}
