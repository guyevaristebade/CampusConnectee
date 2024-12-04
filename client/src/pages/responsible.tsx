import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import { socket } from '../utils';
import { EditStudentModal, Sidebar } from '../components';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { exportToExcel } from '../utils';
import { IStatistics, IStudent } from '../types';
import { DataTable, StudentList } from '../components';
import { Layout, Button, Typography, Row, Col, Tag, Statistic, message, Spin } from 'antd';
import { 
    deleteStudentById, 
    fetchAllStudent, 
    fetchDailyAttendance, 
    fetchStatistics, 
    fetchTotalSTudentHoursPerWeek, 
    updateStudent
} from '../api';


const { Header, Content } = Layout;
const { Title } = Typography;

export const ResponsiblePage: React.FC = () => {
    const { user, logout } = useAuth();
    let navigate = useNavigate();

    const [dailyAttendance, setDailyAttendance] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [attendancePerWeek, setAttendancePerWeek] = useState<any[]>([]);
    const [selectedMenuKey, setSelectedMenuKey] = useState<string>('dashboard');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
    
    
    const dailyAttendanceColumns = [
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

    const weeklyAttendanceColumns = [
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


    const onDateRangeChange = (dates: any) => {
        console.log(dates)
    };
    
        
    const onMenuClick = (e: any) => {
        const newKey = e.key;
        localStorage.setItem('selectedMenuKey', newKey);
        setSelectedMenuKey(newKey);
    };

    const onDeleteStudent =  (id: string) => {
        deleteStudentById(id)
            .then((response) => {
                if (response.success) {
                    message.success(response.msg);
                    const newStudents : IStudent[] = students.filter(student => student._id !== id);
        setStudents(newStudents);
                } else {
                    message.error(response.msg);
                }
            })
        
    };

    const onEditStudent = (id: string) => {
        const newStudent : IStudent | null = students.find((s) => s._id === id) || null;
        setSelectedStudent(newStudent);
        setIsModalVisible(true);
    }

    const onUpdateStudent = (student: IStudent) => {
        // updateStudent(student._id, student)
        //     .then((response) => {
        //         if (response.success) {
        //             message.success(response.msg);
        //             const newStudents = students.map((s) => s._id === student._id ? student : s);
        //             setStudents(newStudents);
        //         } else {
        //             message.error(response.msg);
        //         }
        //     })
    }

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
                message.error('Erreur lors de la récupération des données', 10);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const selectedMenuKey = localStorage.getItem('selectedMenuKey');
        if (selectedMenuKey) {
            setSelectedMenuKey(selectedMenuKey);
        }
    }, []);
    

    useEffect(() => {
        const handleArrival = (data: any) => {
            message.success(`${data.first_name} ${data.last_name} Vient d'arriver au campus`, 10);
        
        };
        const handleDeparture = (data: any) => {
            message.success(`${data.first_name} ${data.last_name} Vient de partir au campus`, 10);
        };
    
        socket.on('new-arrival', handleArrival);
        socket.on('new-departure', handleDeparture);
    
        return () => {
            socket.off('new-arrival', handleArrival);
            socket.off('new-departure', handleDeparture);
        };
    }, []);
    


    if(!dailyAttendance || !statistics || !students || !attendancePerWeek){
        return (
            <Content className='flex justify-center items-center min-h-screen'>
                <Spin 
                    fullscreen={true} 
                    className='flex justify-center items-center' 
                    size='large'
                />
            </Content>
        )
    }

    return (
        <Layout className='min-h-screen'> {/* min-h-screen => min-height : 100vh */}
            <Sidebar
                selectedMenuKey={selectedMenuKey}
                onMenuClick={onMenuClick}
            />

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

                <Content className='px-10 py-5 overflow-scroll'>
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
                        </>
                    )}

                    {selectedMenuKey === 'dailyAttendance' && (
                        <>
                            <Title level={2} className='mb-10'>Émargement de la journée</Title>
                            <DataTable 
                                columns={dailyAttendanceColumns} 
                                dataSource={dailyAttendance}
                                rowKey='_id'
                                onDownload={handleDownloadXLSX}
                                downloadTitle={`Liste_emargement_journalier-${new Date().toISOString().split('T')[0]}`}
                            />
                        </>
                    )}

                    {selectedMenuKey === 'totalHoursPerWeek' && (
                        <>
                            <Title level={2}>Nombre d'heure total pour la semaine en cours
                            </Title>
                            <DataTable 
                                columns={weeklyAttendanceColumns}
                                dataSource={attendancePerWeek}
                                rowKey="_id"
                                onDownload={handleDownloadXLSX}
                                downloadTitle={`Liste_emargement_semaine_en_course-${new Date().toISOString().split('T')[0]}`}
                            />
                        </>
                    )}

                    {selectedMenuKey === 'studentList' && (
                        <>
                            <Title level={2}>Liste des étudiants</Title>
                            <StudentList
                                students={students}
                                handleDelete={onDeleteStudent}
                                handleEdit={onEditStudent}
                            />
                        </>
                    )}
                    <EditStudentModal
                        student={selectedStudent}
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        // onSave={(student) => {
                        //     const newStudents = students.map((s) => s._id === student._id ? student : s);
                        //     setStudents(newStudents);
                        // }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};
