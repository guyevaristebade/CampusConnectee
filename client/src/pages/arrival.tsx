import React, { useState, useMemo } from 'react';
import { Layout, Form, Row, Col, message, Spin, Result, Button } from "antd";
import Confetti from 'react-confetti';
import { IArrival, IStudentType } from '../types';
import { fetchAllStudents, registeredArrival } from '../api';
import { AttendanceForm, Panel } from '../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
const { Content } = Layout;

export const ArrivalPage: React.FC = () => {
    const [form] = Form.useForm();

    const queryClient = useQueryClient();
    const attendanceFormMutation = useMutation({
        mutationFn: registeredArrival,
        onSuccess: (response) => {
            if (response.success) {
                message.success(response.msg);
                queryClient.invalidateQueries({ queryKey: ['attendance']});
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                form.resetFields();
            } else {
                message.error(response.msg);
            }
        },
        onError: (error) => {
            message.error('Erreur lors de l\'enregistrement de l\'arrivée');
        },
    })
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    
    const { data: students, error: studentsError, isLoading: studentsLoading } = useQuery({queryKey : ['students'], queryFn : fetchAllStudents});

    // Mémorise le tableau de nom d'étudiant pour éviter les rendu inutile 
    const studentOptions = useMemo(() => 
        Array.isArray(students) ? students.map((student: IStudentType) => ({
            value: student._id,
            label: `${student.last_name.toUpperCase()} ${student.first_name.toLowerCase()}`
        })) : [], [students]);
        

    // Formulaire d'entrée des informations d'arrivée
    const onFinish = (values: IArrival)  => {
        attendanceFormMutation.mutate(values);
    };

    if(studentsError){
        return <Content className='flex justify-center py-10 bg-transparent'>
            <Result 
                title="Une erreur s'est produit au niveau de la page d'arrivé" 
            />
        </Content>
    }

    
    if(studentsLoading){
        return <Content className='flex justify-center py-10 bg-[#2c2a2a]'>
            <Spin size='large'/>
        </Content>
    }

    return (
        <>
            <Panel/>
            <Content className='flex justify-center py-10 bg-white'>
                
                {/* Affiche les confettis si showConfetti est true */} 
                {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
                <Row  className='text-center max-w-md w-full'> {/* max-w-md : max-width : 448px */}
                    <Col span={24}>
                        <AttendanceForm 
                            onFinish={onFinish} 
                            firstFieldName='student_id' 
                            studentOptions={Array.isArray(studentOptions) ? studentOptions : []} 
                            buttonText='Arrivé' 
                            buttonColor='#000091'
                            form={form}
                        />
                    </Col>
                </Row>
            </Content>
        </>
    );
};
