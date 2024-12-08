import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Form, Row, Col, message } from "antd";
import Confetti from 'react-confetti';
import { IArrival, IStudentType } from '../types';
import { fetchAllStudent, registeredArrival } from '../api';
import { AttendanceForm, Panel } from '../components';
const { Content } = Layout;

export const ArrivalPage: React.FC = () => {
    const [form] = Form.useForm();

        
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [studentArray, setStudentArray] = useState<IStudentType[]>([]);


    // Mémorise le tableau de nom d'étudiant pour éviter les rendu inutile 
    const studentOptions = useMemo(() => 
        studentArray.map(student => ({
            value: student._id,
            label: `${student.last_name.toLowerCase()} ${student.first_name.toLowerCase()}`
    })), [studentArray]);

    

    // Formulaire d'entrée des informations d'arrivée
    const onFinish = (values: IArrival) => {
        registeredArrival(values)
            .then((data) => {
                if(data.success){
                    message.success(data.msg);
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000); 
                    form.resetFields();
                }else{
                    message.error(data.msg);
                }
            })
    };
    
    
    // useEffect(() => {
    //     window.addEventListener("resize", handleResize);
    //     return () => window.removeEventListener("resize", handleResize);
    // }, [handleResize]);
    
    useEffect(() => {
        fetchAllStudent()
        .then((data) => {
            if(data.success){
                setStudentArray(data.data);
            }else{
                setStudentArray([]);
            }
        })
    },[])



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
                            studentOptions={studentOptions} 
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
