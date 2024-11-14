import { Button, Form, Input, Select, FormInstance } from 'antd';
import React from 'react';

interface AttendanceFormProps {
    onFinish: (values: any) => void;
    firstFieldName: string;
    secondFieldName: string;
    studentOptions: any[];
    buttonText: string;
    buttonColor: string;
    form: FormInstance<any>;
    studentErrorMessage?: string;  // Optionnel : pour personnaliser les messages d'erreur
    timeErrorMessage?: string; // Optionnel : pour personnaliser les messages d'erreur pour l'heure
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
    onFinish, 
    firstFieldName,
    secondFieldName,
    studentOptions,
    buttonText,
    buttonColor,
    form
}) => {
    return (
        <Form
            form={form}
            name="attendance-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className='w-full max-md:px-2' 
        >
            <Form.Item
                name={firstFieldName}
                rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisateur!' }]}
            >
                <Select
                    size="large"
                    placeholder="Choisissez un utilisateur"
                    showSearch
                    options={studentOptions}
                    className="text-left"
                    filterOption={(input, option) =>
                        option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                    }
                    filterSort={(a, b) => {
                        const nameA = a.label.toLowerCase();
                        const nameB = b.label.toLowerCase();
                        return nameA.localeCompare(nameB);
                    }}
                />
            </Form.Item>

            <Form.Item
                name={secondFieldName}
                rules={[{ required: true, message: "Veuillez remplir le champs des heures" }]}
            >
                <Input
                    type="time"
                    size="large"
                    placeholder="08:24"
                    className="p-2.5 text-lg"
                />
            </Form.Item>

            <Form.Item className="text-center mt-5">
                <Button
                    type="text"
                    htmlType="submit"
                    size="large"
                    className="w-full text-lg text-white"
                    style={{ backgroundColor: buttonColor }}
                >
                    {buttonText}
                </Button>
            </Form.Item>
        </Form>
    );
};
