import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks';
import { socket } from '../utils';
import { EditStudentModal, Sidebar } from '../components';
import { LogoutOutlined } from '@ant-design/icons';
import { exportToExcel } from '../utils';
import { IStatistics, IStudent, IStudentData } from '../types';
import { DataTable, StudentList } from '../components';
import { Layout, Button, Typography, Row, Col, Tag, Statistic, message, Spin, Form, Input, TabsProps, Table, Tabs } from 'antd';
import { 
    createStudent,
    deleteStudentById, 
    fetchAllStudent, 
    fetchDailyAttendance, 
    fetchStatistics, 
    fetchTotalSTudentHoursPerWeek, 
} from '../api';

const { Header, Content } = Layout;
const { Title } = Typography;

export const ResponsiblePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [form] = Form.useForm();

    const [dailyAttendance, setDailyAttendance] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [attendancePerWeek, setAttendancePerWeek] = useState<any[]>([]);
    const [selectedMenuKey, setSelectedMenuKey] = useState<string>('dashboard');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
    const [search,setSearch] = useState<string>('');
   
    
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


    const onSearchChange = (e: any) => {
        setSearch(e.target.value);
    };

    const filteredStudents = useMemo(() => {
        return students.filter((student) => 
            student.first_name.toLowerCase().includes(search.toLowerCase()) || 
            student.last_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [students, search]);


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

    const onAddStudent = () => {
        const studentData : IStudentData = form.getFieldsValue();
            createStudent(studentData)
                .then((response) => {
                    if (response.success) {
                        message.success(response.msg);
                        const newStudents : IStudent[] = [...students, response.data].sort((a, b) => a.first_name.localeCompare(b.first_name));
                        setStudents(newStudents);
                        form.resetFields();
                    } else {
                        message.error(response.msg);
                    }
                })
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

    const items: TabsProps['items'] = [
        {
            key: 'table',
            label: 'Liste au format Card ',
            children: <StudentList
                students={filteredStudents}
                handleDelete={onDeleteStudent}
                handleEdit={onEditStudent}
                />
        },
        {
            key: 'card',
            label: 'Liste au format tableau',
            children: <Table 
                columns={studentColumns} 
                dataSource={filteredStudents} 
                rowKey={'_id'}
                pagination = {(filteredStudents.length > 6) ? {pageSize: 6} : false}
                />
        }
    ];

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
        <Layout className='min-h-screen flex'> {/* min-h-screen => min-height : 100vh */}
            <Sidebar
                selectedMenuKey={selectedMenuKey}
                onMenuClick={onMenuClick}
            />

            <Layout className='flex flex-col flex-1'>
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
                <div className="flex-1 overflow-y-auto">
                    <Content className='px-10 py-5'>
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
                                <Input className='my-5' size='large' placeholder='Timothée' defaultValue={search} onChange={onSearchChange} />

                                <Tabs defaultActiveKey="1" items={items} />;
                            </>
                        )}
                        {selectedMenuKey === 'addStudent' && (
                            <>
                                <Title className="mb-8" level={3}>Ajouter un étudiant</Title>

                                <Form 
                                    form={form} 
                                    layout="vertical" 
                                    className='grid gap-4 grid-cols-1 md:grid-cols-2'
                                    onFinish={onAddStudent}
                                >
                                    <Form.Item
                                        name="first_name"
                                        label="Prénom"
                                        rules={[{ required: true, message: 'Veuillez entrer le prénom' }]}
                                    >
                                        <Input size='large' />
                                    </Form.Item>
                                    <Form.Item
                                        name="last_name"
                                        label="Nom de famille"
                                        rules={[{ required: true, message: 'Veuillez entrer le nom de famille' }]}
                                    >
                                        <Input size='large'  />
                                    </Form.Item>
                                    <Form.Item className='col-span-2 flex justify-end'>
                                        <Button className='bg-[#000091] p-6 text-white' htmlType="submit">
                                            Enregistrer
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </>
                        )}
                        <EditStudentModal
                            student={selectedStudent}
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                        />
                    </Content>
                </div>
            </Layout>
        </Layout>
    );
};
