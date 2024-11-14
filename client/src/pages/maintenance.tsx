import React from 'react';
import { Layout, Typography, Row, Col } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

export const MaintenancePage: React.FC = () => {

    return (
        <Layout className='min-h-screen flex justify-center items-center' >
            <Content>
                <Row justify="center">
                    <Col xs={24} sm={20} md={16} lg={12} xl={10} className='text-center p-5'>
                        <Title level={2} className='text-[clamp(24px, 5vw, 36px)]'>Site en Maintenance</Title>
                        <Text type="secondary" className='text-[16px]'>
                            Nous travaillons actuellement pour améliorer notre site. Nous serons de retour sous peu !
                        </Text>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

