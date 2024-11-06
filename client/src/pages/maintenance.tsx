import React from 'react';
import { Layout, Typography, Button, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

export const MaintenancePage: React.FC = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Content>
                <Row justify="center">
                    <Col xs={24} sm={20} md={16} lg={12} xl={10} style={{ textAlign: 'center', padding: '20px' }}>
                        <Title level={2} style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>Site en Maintenance</Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                            Nous travaillons actuellement pour améliorer notre site. Nous serons de retour sous peu !
                        </Text>
                        <div style={{ marginTop: '30px' }}>
                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<ReloadOutlined />} 
                                onClick={handleRefresh}
                                style={{ fontSize: '16px' }}
                            >
                                Actualiser
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

