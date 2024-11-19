import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Form, Typography, Row, Col, message, Spin } from "antd";
import Confetti from 'react-confetti';
import { IDeparture, IStudentType } from '../types';
import { fetchAllStudent, registeredDeparture } from '../api';
import { AttendanceForm, Panel } from '../components';
import { useLocation } from '../context';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

export const DeparturePage: React.FC = () => {
    const [form] = Form.useForm();
    const { isAtCampus, loading } = useLocation();
    const navigate = useNavigate();

    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [studentArray, setStudentArray] = useState<IStudentType[]>([]);


    const studentOptions = useMemo(() => 
        studentArray.map(student => ({
            value: student._id,
            label: `${student.last_name.toLowerCase()} ${student.first_name.toLowerCase()}`
    })), [studentArray]);

    // Fonction pour mettre à jour la taille de la fenêtre
    const handleResize = useCallback(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);


    const onFinish = async (values: IDeparture) => {
        console.log(values)
        registeredDeparture(values)
            .then((data) =>{
                if(data.success){
                    message.success("Au revoir ! J'espère que vous avez survécu à cette journée avec le sourire... À la prochaine aventure !");
                    
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000); 
                    form.resetFields();
                }else{
                    message.error("Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !");
                }
            })
        
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    useEffect(() => {
        // Récupère les étudiants
        fetchAllStudent()
            .then((data) => {
                if(data.success){
                    setStudentArray(data.data);
                }else{
                    setStudentArray([]);
                }
            })
    },[])


    if (loading) {
        return <Content className='flex justify-center items-center min-h-full'>
            <Spin percent='auto' size='large'/> 
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
                            secondFieldName='departure_time'
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
