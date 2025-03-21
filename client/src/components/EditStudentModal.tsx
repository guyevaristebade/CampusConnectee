import React, { useEffect } from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import { IStudent, IStudentData } from '../types'
import { updateStudent } from '../api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface EditStudentModalProps {
    visible: boolean
    student: IStudent | null
    onCancel: () => void
}
export const EditStudentModal: React.FC<EditStudentModalProps> = ({
    student,
    visible,
    onCancel,
}) => {
    const [form] = Form.useForm()
    const queryClient = useQueryClient()

    const updateStudentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: IStudentData }) =>
            updateStudent(id, data),
        onSuccess: (response) => {
            if (response.success) {
                message.success("L'étudiant a été modifié avec succès")
                form.resetFields()
                onCancel()
            } else {
                message.error(response.msg)
            }
        },
    })

    useEffect(() => {
        if (student) {
            form.setFieldsValue({
                first_name: student.first_name,
                last_name: student.last_name,
            })
        }
    }, [student, form])

    const handleSave = () => {
        const studentInfos: IStudentData = form.getFieldsValue()
        if (student?._id) {
            updateStudentMutation.mutate(
                { id: student._id, data: studentInfos },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: ['students'],
                        })
                    },
                }
            )
        }
    }

    return (
        <Modal
            className="relative"
            open={visible}
            title="Éditer les informations de l'étudiant"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Annuler
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Sauvegarder
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Prénom" name="first_name">
                    <Input size="large" type="text" />
                </Form.Item>
                <Form.Item label="Nom" name="last_name">
                    <Input size="large" type="text" />
                </Form.Item>
            </Form>
        </Modal>
    )
}
