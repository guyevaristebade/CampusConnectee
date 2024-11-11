import React, { useState, useEffect } from 'react';
import { Image, Layout, Menu, Button, Table, DatePicker, Typography, Row, Col, Tag } from 'antd';
import Icon, { DownloadOutlined, LogoutOutlined, UnorderedListOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../hooks'; 
import { fetchDailyAttendance } from '../api';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

export const ResponsiblePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [dailyAttendance, setDailyAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRangeAttendance, setDateRangeAttendance] = useState([
        dayjs().startOf('week'),
        dayjs().endOf('week')
    ]);
    const [selectedKey, setSelectedKey] = useState<string>('attendance');  // To track the selected menu item

    // Columns configuration for the tables
    const columns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Heure d\'arrivée', dataIndex: 'arrival_time', key: 'arrival_time' },
        { title: 'Heure de départ', dataIndex: 'departure_time', key: 'departure_time' },
        { title: 'Total d\'heures', dataIndex: 'total_hours', key: 'total_hours' },
        { 
            title: 'Statut', 
            dataIndex: 'status', 
            key: 'status',
            render: (text: string) => {
                if (text === 'completed') {
                    return <Tag color="green">Terminé</Tag>;
                } else {
                    return <Tag color="orange">En cours</Tag>;
                } 
            }
        }
    ];

    const items = [
        {
            key: 'attendance',
            icon: <CalendarOutlined />,
            label: 'Émargement quotidien',
            icons : <UnorderedListOutlined />
        },
        {
            key:'dateRange',
            icon: <DownloadOutlined />,
            label: 'Émargement par intervalle',
            icons : <CalendarOutlined />
        }
    ]

    // Fetch data on initial render
    useEffect(() => {
        fetchDailyAttendance()
            .then((data) => {
                if (data.success) {
                    setDailyAttendance(data.data);
                } else {
                    setDailyAttendance([]);
                }
            })
    }, []);

    // Event handler for fetching attendance data by date range
    const onDateRangeChange = (dates: any) => {
        console.log(dates);
    };

    // Event handler for switching between menu items
    const onMenuClick = (e: any) => {
        setSelectedKey(e.key);
    };




    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sider width={250} className='bg-white text-black'>
                <div className="logo text-black mb-6" style={{ textAlign: 'center', padding: '20px' }}>
                    <Image  width={200} src={"/CC_RVB.png"} preview={false}/>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={onMenuClick}
                    items={items}
                    className='bg-white'
                />
            </Sider>

            {/* Main Layout */}
            <Layout>
                {/* Header */}
                <Header className='bg-white' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000' }}>
                    <div>Bienvenue, {user?.username}</div>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={logout}
                        style={{ color: '#fff', backgroundColor: 'red', cursor: 'pointer' }}
                    >
                        Déconnexion
                    </Button>
                </Header>

                {/* Content */}
                <Content style={{ padding: '20px 40px' }}>
                    {selectedKey === 'attendance' && (
                        <>
                            <Title level={3}>Émargement de la journée</Title>
                            <Table
                                columns={columns}
                                dataSource={dailyAttendance}
                                rowKey="_id"
                                pagination={false}
                            />
                            <Button
                                icon={<DownloadOutlined />}
                                style={{ marginTop: '10px' }}
                            >
                                Télécharger en PDF
                            </Button>
                        </>
                    )}

                    {selectedKey === 'dateRange' && (
                        <>
                            <Title level={3}>Émargement par intervalle de dates</Title>
                            <Row>
                                <Col span={24} style={{ marginBottom: '20px' }}>
                                    <RangePicker 
                                        onChange={onDateRangeChange}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Télécharger en XLSX
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
