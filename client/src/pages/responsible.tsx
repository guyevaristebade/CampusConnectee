import React, { useState, useEffect } from 'react';
import { Image, Layout, Menu, Button, Table, DatePicker, Typography, Row, Col, Tag, Statistic } from 'antd';
import { DownloadOutlined, LogoutOutlined, UnorderedListOutlined, CalendarOutlined, AppstoreOutlined, FieldTimeOutlined, TableOutlined } from '@ant-design/icons';
import { fetchAllStudent, fetchDailyAttendance, fetchStatistics, fetchTotalSTudentHoursPerWeek } from '../api';
import { IStatistics, IStudent } from '../types';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

export const ResponsiblePage: React.FC = () => {
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
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Heure d\'arrivée', dataIndex: 'arrival_time', key: 'arrival_time' },
        { title: 'Heure de départ', dataIndex: 'departure_time', key: 'departure_time' },
        { title: 'Total d\'heures', dataIndex: 'total_hours', key: 'total_hours' },
        { 
            title: 'Statut', 
            dataIndex: 'status', 
            key: 'status',
            render: (text: string) => text === 'completed' ? <Tag color="green">Terminé</Tag> : <Tag color="orange">En cours</Tag>
        }
    ];

    const attendancePerWeekColumns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
        { 
            title: 'Total d\'heure', 
            dataIndex: 'total_hours', 
            key: 'total_hours',
            render: (value: number) => {
                const color = value < 12 ? 'red' : 'green';
                return <Tag color={color} className='w-[50px] text-center'>{value}</Tag>;
            }
        },
    ];

    const studentColumns = [
        { title: 'Nom', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Prénom', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Action', dataIndex: 'action', key: 'action' },
    ];

    const menuItems = [
        { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: 'attendance', icon: <CalendarOutlined />, label: 'Émargement quotidien' },
        { key: 'totalHoursPerWeek', icon: <TableOutlined />, label: 'Émargement hebdomadaire' },
        { key: 'dateRange', icon: <FieldTimeOutlined />, label: 'Émargement par intervale' },
    ];

    const studentData = students.map((student) => ({
        key: student._id,
        last_name: student.last_name,
        first_name: student.first_name,
        action: <Button type="default" className="bg-red-600 text-white cursor-pointer" onClick={() => onDeleteStudent(student._id)}>Supprimer</Button>,
    }));

    // Fetch data on initial render
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

    const onDateRangeChange = (dates: any) => {
        console.log(dates);
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

    const handleDownloadXLSX = () => {
        // Implement XLSX download logic here if needed
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} className="bg-white text-black">
                <div className="logo text-black mb-6" style={{ textAlign: 'center', padding: '20px' }}>
                    <Image width={200} src="/CC_RVB.png" preview={false} />
                </div>
                <Menu mode="inline" selectedKeys={[selectedKey]} onClick={onMenuClick} items={menuItems} className="bg-white" />
            </Sider>

            <Layout>
                <Header className="bg-white" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        style={{ color: '#fff', backgroundColor: 'red', cursor: 'pointer' }}
                    >
                        Déconnexion
                    </Button>
                </Header>

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
                                onClick={handleDownloadXLSX}
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
                                    <Button icon={<DownloadOutlined />} style={{ marginTop: '10px' }}>
                                        Télécharger en PDF
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}

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
                                        dataSource={studentData}
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
                </Content>
            </Layout>
        </Layout>
    );
};
