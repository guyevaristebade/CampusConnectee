import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout, Form, Typography, Button, Row, Col, Input, Select, message } from "antd";
import Confetti from 'react-confetti';
import { IArrival, IStudentType } from '../types';
import { fetchAllStudent, registeredArrival } from '../api';
import { Panel } from '../components';
const { Content } = Layout;
const { Title } = Typography;

export const ArrivalPage: React.FC = () => {
    const [form] = Form.useForm();
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [studentArray, setStudentArray] = useState<IStudentType[]>([]);

    // Fonction pour mettre à jour la taille de la fenêtre
    const handleResize = useCallback(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);
    

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
                    message.success(" 🎉 Vous êtes officiellement arrivé ! Félicitations, vous avez réussi à vous lever ce matin 😉");
                    
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
                        {/* <Title level={3}  className="mb-5 text-[clamp(20px,4vw,28px)]">
                            Bienvenu sur le campus connecté
                        </Title> */}

                        <Form
                            form={form}
                            name="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            className='w-full max-md:px-2' // width="100%"
                        >
                            <Form.Item
                                name="student_id"
                                rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisateur!' }]}
                            >
                                <Select
                                    size='large'
                                    placeholder="Choisissez un utilisateur"
                                    showSearch
                                    options={studentOptions}
                                    className='text-left'
                                    filterOption={(input, option) => option ? option.label.includes(input.toLowerCase()) : false} // permet de ranger les nom des étudiants suivant un ordre alphabétique
        
                                    filterSort={(a, b) => {
                                        const nameA = `${a.label}`.toLowerCase(); 
                                        const nameB = `${b.label}`.toLowerCase(); 
                                        return nameA.localeCompare(nameB); 
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="arrival_time"
                                rules={[{ required: true, message: 'Veuillez remplir ce champ' }]}
                            >
                                <Input
                                    type='time'
                                    size="large"
                                    placeholder="08:24"
                                    className='p-2.5 text-lg'
                                />
                            </Form.Item>

                            <Form.Item style={{ textAlign: "center", marginTop: "20px" }} className='text-center'>
                                <Button type="text" htmlType="submit" size="large" className='w-full text-lg bg-[#000091] text-white'>
                                    Arrivé
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </>
    );
};
