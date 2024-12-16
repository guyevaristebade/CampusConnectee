import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Form, Row, Col, message, Spin } from "antd";
import Confetti from 'react-confetti';
import { IDeparture, IStudentType } from '../types';
import { fetchAllStudents, registeredDeparture } from '../api';
import { AttendanceForm, Panel } from '../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
const { Content } = Layout;

export const DeparturePage: React.FC = () => {
    const [form] = Form.useForm();
    const { data: students, error: studentsError, isLoading: studentsLoading } = useQuery({queryKey : ['students'], queryFn : fetchAllStudents});
    
    const queryClient = useQueryClient();
    const attendanceFormMutation = useMutation({
        mutationFn: registeredDeparture,
        onSuccess: (response) => {
            if (response.success) {
                message.success("Au revoir ! J'espère que vous avez survécu à cette journée avec le sourire... À la prochaine aventure !");
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000); 
                form.resetFields();
            } else {
                message.error(response.msg);
            }
        },
        onError: (error) => {
            message.error("Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !");
        },
    })

    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const studentOptions = useMemo(() => 
        Array.isArray(students) ? students.map(student => ({
            value: student._id,
            label: `${student.last_name.toUpperCase()} ${student.first_name.toLowerCase()}`
    })) : [], [students]);

    console.log(students);

    // Fonction pour mettre à jour la taille de la fenêtre
    const handleResize = useCallback(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);


    const onFinish = async (values: IDeparture) => {
        attendanceFormMutation.mutate(values);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

        
    if(studentsLoading){
        return <Content className='flex justify-center py-10 bg-transparent'>
            <Spin size='large'/>
        </Content>
    }


    return (
        <>
            <Panel/>
            <Content className='flex justify-center py-10 bg-white p-5'>
                {/* Affiche les confettis si showConfetti est true */}
                {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

                <Row justify="center"  className='text-center max-w-md w-full'>
                    <Col span={24}>
                        <AttendanceForm 
                            firstFieldName='student_id'
                            buttonColor='#E1000F' 
                            buttonText='Départ' 
                            onFinish={onFinish} 
                            studentOptions={studentOptions}
                            form={form}
                        />
                    </Col>
                </Row>
            </Content>
        </>
    );
};
