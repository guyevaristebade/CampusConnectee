import { Form, Modal, Popconfirm, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useEditArrivalTime } from '../api'
import { CheckCircleOutlined } from '@ant-design/icons'
export const EditArrivalTimeModal = ({
    visible,
    onCancel,
    attendance,
    api,
}: {
    visible: boolean
    onCancel: () => void
    attendance: any
    api?: any
}) => {
    const [form] = Form.useForm()
    const { mutate: editArrivalTimeMutation } = useEditArrivalTime()

    useEffect(() => {
        if (attendance) {
            form.setFieldsValue({
                arrival_time: dayjs(attendance.arrival_time, 'HH:mm'),
            })
        }
    }, [attendance, form])

    const handleSave = () => {
        form.validateFields().then((values) => {
            const updatedTime = values.arrival_time.format('HH:mm')
            editArrivalTimeMutation(
                {
                    id: attendance._id,
                    arrivalData: { arrival_time: updatedTime },
                },
                {
                    onSuccess() {
                        onCancel()
                        api['success']({
                            message:
                                "Notification de modification d'heure d'arrivée",
                            description:
                                "L'heure d'arrivée a été modifiée avec succès",
                            showProgress: true,
                            icon: (
                                <CheckCircleOutlined
                                    style={{ color: 'green' }}
                                />
                            ),
                        })
                    },
                }
            )
        })
    }

    return (
        <Modal
            title="Modifier l'heure d'arrivée"
            open={visible}
            onCancel={onCancel}
            onOk={handleSave}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="arrival_time"
                    label="Nouvelle heure d'arrivée"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez sélectionner une heure',
                        },
                    ]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
            </Form>
        </Modal>
    )
}
