import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout, Form, Typography, Button, Row, Col, Input, Select, message, TimePicker } from "antd";
import Confetti from 'react-confetti';
import { IArrival, IStudentType } from '../types';
import { fetchAllStudent, registeredArrival } from '../api';

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
                    setTimeout(() => setShowConfetti(false), 3000); // on montre les confétti pendant 3s
                    form.resetFields();
                }else{
                    message.error("Oups ! Une erreur s'est glissée par ici... Nos développeurs sont en mode super-héros, mais ils ont besoin de votre signal pour intervenir !");
                    //message.error(data.msg)
                    
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


    return (
        <Content style={{ padding: "20px",display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Affiche les confettis si showConfetti est true */}
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

            <Row justify="center" style={{ textAlign: "center", maxWidth : "400px", width: "100%" }}>
                <Col span={24}>
                    <Title level={3} style={{ marginBottom: "20px", fontSize: "clamp(20px, 4vw, 28px)" }}>
                        Bienvenu sur le campus connecté
                    </Title>

                    <Form
                        form={form}
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ maxWidth: "100%" }}
                    >
                        <Form.Item
                            name="student_id"
                            rules={[{ required: true, message: 'Veuillez entrer     votre nom d\'utilisateur!' }]}
                        >
                            <Select
                                size='large'
                                placeholder="Choisissez un utilisateur"
                                showSearch
                                options={studentOptions}
                                style={{ textAlign: 'left',  }}
                                filterOption={(input, option) => option ? option.label.includes(input.toLowerCase()) : false}
    
                                filterSort={(a, b) => {
                                    const nameA = `${a.label}`.toLowerCase(); 
                                    const nameB = `${b.label}`.toLowerCase(); 
                                    return nameA.localeCompare(nameB); // trier par ordre alphabétique
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="arrival_time"
                            rules={[{ required: true, message: 'Veuillez remplir ce champ' }]}
                        >
                            <Input
                                type='time'
                                placeholder="08:24"
                                style={{ fontSize: "18px", padding: "10px" }}
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ width: "100%", fontSize: "18px", backgroundColor: "green" }}>
                                Arrivé
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Content>
    );
};
