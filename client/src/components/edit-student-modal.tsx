import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { IStudent, IStudentData } from '../types';
import { updateStudent } from '../api';

interface EditStudentModalProps {
    visible: boolean;
    student: IStudent | null;
    onCancel: () => void;
    onSave?: (student: IStudent) => void;
}
export const EditStudentModal: React.FC<EditStudentModalProps> = ({student, visible, onCancel}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (student) {
            form.setFieldsValue({
                first_name: student.first_name,
                last_name: student.last_name,
            });
        }
    }, [student, form]);


    const handleSave = () => {
        const studentInfos : IStudentData = form.getFieldsValue();
    };

    return (
        <Modal
            className='relative'
            open={visible}
            title="Éditer les informations de l'étudiant"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Annuler</Button>,
                <Button key="save" type="primary" onClick={handleSave}>Sauvegarder</Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Prénom"
                    name="first_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Nom"
                    name="last_name"
                >
                    <Input />
                </Form.Item>
                {/* Ajoutez d'autres champs ici selon vos besoins */}
            </Form>
        </Modal>
    );
};

