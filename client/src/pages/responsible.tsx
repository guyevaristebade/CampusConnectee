import React, { useState, useEffect } from 'react';
import { Image, Layout, Menu, Button, Table, Typography, Row, Col, Tag, Statistic, message } from 'antd';
import { DownloadOutlined, LogoutOutlined, CalendarOutlined, AppstoreOutlined, FieldTimeOutlined, TableOutlined } from '@ant-design/icons';
import { fetchAllStudent, fetchDailyAttendance, fetchStatistics, fetchTotalSTudentHoursPerWeek } from '../api';
import { IStatistics, IStudent } from '../types';
import { useAuth } from '../hooks';
import { exportToExcel } from '../utils';
import { DataTable } from '../components';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export const ResponsiblePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [dailyAttendance, setDailyAttendance] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [attendancePerWeek, setAttendancePerWeek] = useState<any[]>([]);
    const [selectedMenuKey, setSelectedMenuKey] = useState<string>('dashboard');
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
        { 
            title: 'Action', 
            dataIndex: 'action', 
            key: 'action',
            render: (_:any,record: IStudent) => (
                <Button 
                    type="default" 
                    className="bg-red-600 text-white cursor-pointer"
                    onClick={() => onDeleteStudent(record._id)}
                >
                    Supprimer
                </Button>
            )
        }
    ];
    

    const menuItems = [
        { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: 'dailyAttendance', icon: <CalendarOutlined />, label: 'Émargement quotidien' },
        { key: 'totalHoursPerWeek', icon: <TableOutlined />, label: 'Émargement hebdomadaire' },
    ];



    const onDateRangeChange = (dates: any) => {
        console.log(dates)
    };
    
    
    const onMenuClick = (e: any) => {
        setSelectedMenuKey(e.key);
    };

    const onDeleteStudent = (id: string) => {
        // mettre cette logique en place avec l'api
        const delet = students.filter(student => student._id !== id);
        setStudents(delet);
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
            {/* Faire un composant SideBar */}
            <Sider width={250} className="bg-white text-black">
                <div className="logo text-black mb-6 text-center p-5">
                    <Image width={200} src="/logo_cc_nemours.jpg" preview={false} />
                </div>
                <Menu mode="inline" selectedMenuKeys={[selectedMenuKey]} onClick={onMenuClick} items={menuItems} className="bg-white" />
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
                    {selectedMenuKey === 'dashboard' && (
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

                    {selectedMenuKey === 'dailyAttendance' && (
                        <>
                            <Title level={2} className='mb-10'>Émargement de la journée</Title>
                            <DataTable 
                                columns={columns} 
                                dataSource={dailyAttendance}
                                rowKey='_id'
                                onDownload={handleDownloadXLSX}
                                handleTableChange={handleTableChange}
                                currentPage={currentPage}
                                pageSize={pageSize}
                                downloadTitle={`Liste_emargement_journalier-${new Date().toISOString().split('T')[0]}`}
                            />
                        </>
                    )}

                    {selectedMenuKey === 'totalHoursPerWeek' && (
                        <>
                            <Title level={2}>Nombre d'heure total pour la semaine en cours
                            </Title>
                            <DataTable 
                                columns={attendancePerWeekColumns}
                                dataSource={attendancePerWeek}
                                rowKey="_id"
                                onDownload={handleDownloadXLSX}
                                handleTableChange={handleTableChange} 
                                currentPage={currentPage}
                                pageSize={pageSize}
                                downloadTitle={`Liste_emargement_semaine_en_course-${new Date().toISOString().split('T')[0]}`}

                            />
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
