import React, { useState, useEffect } from 'react';
import { Image, Layout, Menu, Button, Table, Typography, Row, Col, Tag, Statistic, message } from 'antd';
import { DownloadOutlined, LogoutOutlined, CalendarOutlined, AppstoreOutlined, FieldTimeOutlined, TableOutlined } from '@ant-design/icons';
import { fetchAllStudent, fetchDailyAttendance, fetchStatistics, fetchTotalSTudentHoursPerWeek } from '../api';
import { IStatistics, IStudent } from '../types';
import { useAuth } from '../hooks';
import { exportToExcel } from '../utils';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export const ResponsiblePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [dailyAttendance, setDailyAttendance] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [attendancePerWeek, setAttendancePerWeek] = useState<any[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>('dashboard');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);


    // Columns configuration for the tables
    const columns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name_1' },
        { title: 'Heure d\'arrivée', dataIndex: 'arrival_time', key: 'arrival_time_1' },
        { title: 'Heure de départ', dataIndex: 'departure_time', key: 'departure_time_1' },
        { title: 'Total d\'heures', dataIndex: 'total_hours', key: 'total_hours_1' },
        { 
            title: 'Statut', 
            dataIndex: 'status', 
            key: 'status_1',
            render: (text: string) => text === 'completed' ? <Tag color="green">Terminé</Tag> : <Tag color="orange">En cours</Tag>
        }
    ];

    const attendancePerWeekColumns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name_2' },
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name_2' },
        { 
            title: 'Total d\'heure', 
            dataIndex: 'total_hours', 
            key: 'total_hours_2',
            render: (value: number) => {
                const color = value < 12 ? 'red' : 'green';
                return <Tag color={color} className='w-[50px] text-center'>{value}</Tag>;
            }
        },
    ];

    const studentColumns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
        // { title: 'Action', dataIndex: 'action', key: 'action', render : (record : any) => {
        //     return <Button type="default" className="bg-red-600 text-white cursor-pointer" onClick={() => onDeleteStudent(record)}>Supprimer</Button>;
        // }},
    ];

    const menuItems = [
        { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: 'dailyAttendance', icon: <CalendarOutlined />, label: 'Émargement quotidien' },
        { key: 'totalHoursPerWeek', icon: <TableOutlined />, label: 'Émargement hebdomadaire' },
        // { key: 'dateRange', icon: <FieldTimeOutlined />, label: 'Émargement par intervale' },
    ];



    const onDateRangeChange = (dates: any) => {
        console.log(dates)
    };
    
    
    const onMenuClick = (e: any) => {
        setSelectedKey(e.key);
    };

    const onDeleteStudent = (id: string) => {
        console.log(id);
    };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleDownloadXLSX = (data : any[], title : string) => {
        const xlsx = exportToExcel(data,title)
        if(xlsx){
            message.success("Ficher téléchargé avec succès")
        }else{
            message.error("Erreur lors du téléchargement du fichier Excel")
        }
    };

    const onLogout = async () => {
        await logout();
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [attendance, allStudents, stat, totalHours] = await Promise.all([
                    fetchDailyAttendance(),
                    fetchAllStudent(),
                    fetchStatistics(),
                    fetchTotalSTudentHoursPerWeek(),
                ]);

                if (attendance.success) setDailyAttendance(attendance.data);
                if (allStudents.success) setStudents(allStudents.data);
                if (stat.success) setStatistics(stat.data);
                if (totalHours.success) setAttendancePerWeek(totalHours.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);



    return (
        <Layout className='min-h-screen'> {/* min-h-screen => min-height : 100vh */}
            <Sider width={250} className="bg-white text-black">
                <div className="logo text-black mb-6 text-center p-5">
                    <Image width={200} src="/logo_cc_nemours.jpg" preview={false} />
                </div>
                <Menu mode="inline" selectedKeys={[selectedKey]} onClick={onMenuClick} items={menuItems} className="bg-white" />
            </Sider>

            <Layout>
                <Header className="bg-white flex  items-center justify-end">
                    Bonjour, {user?.username}
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={onLogout}
                        className='text-white bg-red-600 cursor-pointer mx-2'
                    >
                        Déconnexion
                    </Button>
                </Header>

                <Content style={{ padding: '20px 40px' }}>
                    {selectedKey === 'dashboard' && (
                        <>
                            <Title className="mb-8" level={3}>Dashboard</Title>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Statistic className="bg-white p-4 rounded" value={statistics?.total_student} title="Nombre total d'élève" />
                                </Col>
                                <Col span={8}>
                                    <Statistic className="bg-white p-4 rounded" value={statistics?.daily_student} title="Nombre d'élève présent aujourd'hui" />
                                </Col>
                                <Col span={8}>
                                    <Statistic className="bg-white p-4 rounded" value={statistics?.presence_rate} suffix="%" title="Taux de présence journalier" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Title className="my-12" level={3}>Liste des étudiants du campus</Title>
                                    <Table
                                        columns={studentColumns}
                                        dataSource={students}
                                        rowKey="_id"
                                        pagination={{
                                            current: currentPage,
                                            pageSize: pageSize,
                                            total: students.length,
                                            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                                        }}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}

                    {selectedKey === 'dailyAttendance' && (
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
                                onClick={() => handleDownloadXLSX(dailyAttendance, "emmargement_journalier")}
                            >
                                Télécharger en PDF
                            </Button>
                        </>
                    )}

                    {selectedKey === 'totalHoursPerWeek' && (
                        <>
                            <Title level={3}>Nombre d'heure total pour la semaine en cours
                            </Title>
                            <Row>
                                <Col span={24} style={{ marginBottom: '20px' }}>
                                    {/* <RangePicker onChange={onDateRangeChange} /> */}
                                    <Table
                                        columns={attendancePerWeekColumns}
                                        dataSource={attendancePerWeek}
                                        rowKey="_id"
                                        pagination={{
                                            current: currentPage,
                                            pageSize: pageSize,
                                            total: attendancePerWeek.length,
                                            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                                        }}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Button onClick={() => handleDownloadXLSX(attendancePerWeek, "emmargement_hebdomadaire")}
 icon={<DownloadOutlined />} className='mt-2.5 text-green'>
                                        Télécharger en PDF
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
