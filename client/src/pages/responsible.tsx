import React, { useState, useEffect } from 'react';
import { Image, Layout, Menu, Button, Table, DatePicker, Typography, Row, Col, Tag, Statistic } from 'antd';
import { DownloadOutlined, LogoutOutlined, UnorderedListOutlined, CalendarOutlined, AppstoreOutlined } from '@ant-design/icons';
import { fetchAllStudent, fetchDailyAttendance, fetchStatistics } from '../api';
import { IStatistics } from '../types';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

export const ResponsiblePage: React.FC = () => {
    const [dailyAttendance, setDailyAttendance] = useState([]);
    const [statistics, setStatistics] = useState<IStatistics | null>(null)
    const [students, setStudents] = useState([]);
    const [selectedKey, setSelectedKey] = useState<string>('dashboard');  
    const [currentPage, setCurrentPage] = useState(1); 
    const [pageSize, setPageSize] = useState(5);


    // Columns configuration for the tables
    const columns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name'},
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Heure d\'arrivée', dataIndex: 'arrival_time', key: 'arrival_time' },
        { title: 'Heure de départ', dataIndex: 'departure_time', key: 'departure_time' },
        { title: 'Total d\'heures', dataIndex: 'total_hours', key: 'total_hours', },
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

    const studentColumns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name',},
        { title: "Prénom", dataIndex: 'first_name', key: 'first_name' },
        { title: "Action", dataIndex: 'action', key: 'action'}
    ]

    const items = [
        {
            key: 'dashboard',
            icon: <AppstoreOutlined />,
            label: 'Dashboard',
            icons : <UnorderedListOutlined />
        },
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

    const studentData = students.map((student : {_id : string, last_name : string, first_name : string, action : any}) => {
        return {
            key: student._id,
            last_name: student.last_name,
            first_name: student.first_name,
            action: <Button type='default' className='bg-red-600 text-white cursor-pointer' onClick={() => onDeleteStudent(student._id)}>Supprimer</Button>
        }
    })

    
    // Event handler for fetching attendance data by date range
    const onDateRangeChange = (dates: any) => {
        console.log(dates);
    };
    
    // Event handler for switching between menu items
    const onMenuClick = (e: any) => {
        setSelectedKey(e.key);
    };

    const onDeleteStudent = (id: string) => {
        console.log(id);
    }

    const handleTableChange = (pagination : any) => {
        setCurrentPage(pagination.current); // Mise à jour de la page actuelle
        setPageSize(pagination.pageSize); // Mise à jour de la taille de la page
    };
    
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
        
        fetchAllStudent()
            .then((data) => {
                if(data.success){
                    setStudents(data.data);
                }else{
                    setStudents([]);
                }
            })

        fetchStatistics()
            .then((data) => {
                if(data.success){
                    setStatistics(data.data);
                }else{
                    setStatistics(null);
                }
            })
    }, []);

    //console.log(statistics)



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
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        // onClick={logout}
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

                    {selectedKey === "dashboard" && (
                        <>
                            <Title className='mb-8' level={3}>Dashboard</Title>
                            <Row gutter={[16,16]}>
                                <Col span={8}>
                                    <Statistic className='bg-white p-4 rounded' value={statistics?.total_student} title="Nombre total d'élève" />
                                </Col>
                                <Col span={8}>
                                    <Statistic className='bg-white p-4 rounded' value={statistics?.daily_student} title="Nombre d'élève présent aujourd'hui" />
                                </Col>
                                <Col span={8}>
                                    <Statistic className='bg-white p-4 rounded' value={statistics?.presence_rate} suffix="%" title="Taux de présence journalier" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Title className='my-12' level={3}>Liste des étudiants du campus</Title>
                                    <Table
                                        columns={studentColumns}
                                        dataSource={studentData}
                                        rowKey="_id"
                                        pagination={{
                                            current: currentPage,
                                            pageSize: pageSize,
                                            total: 10,
                                            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize })
                                        }}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
