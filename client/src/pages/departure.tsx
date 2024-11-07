import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Form, Typography, Button, Row, Col, Input, Select, message } from "antd";
import Confetti from 'react-confetti';
import { IDeparture, IStudentType } from '../types';
import { fetchAllStudent, registeredDeparture } from '../api';

const { Content } = Layout;
const { Title } = Typography;

export const DeparturePage: React.FC = () => {
    const [form] = Form.useForm();
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
                        Vous êtes sur le départ ?
                    </Title>

                    <Form
                        form={form}
                        name="departure"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ maxWidth: "100%" }}
                    >
                        <Form.Item
                            name="student_id"
                            rules={[{ required: true, message: 'Veuillez remplir ce champ' }]}
                        >
                            <Select
                                options={studentOptions}
                                size='large'
                                placeholder="Choisissez un utilisateur"
                                showSearch
                                style={{ textAlign: 'left' }}
                                filterOption={(input,option) => option ? option.label.includes(input.toLowerCase()): false}
                                filterSort={(a, b) => {
                                    const nameA = `${a.label}`.toLowerCase(); 
                                    const nameB = `${b.label}`.toLowerCase(); 
                                    return nameA.localeCompare(nameB); 
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="departure_time"
                            rules={[{ required: true, message: 'Veuillez remplir ce champ' }]}
                        >
                            <Input
                                type='time'
                                size="large"
                                placeholder="08:24"
                                style={{ fontSize: "18px", padding: "10px" }}
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ width: "100%", fontSize: "18px", backgroundColor: "red" }}>
                                Arrivé
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Content>
    );
};
