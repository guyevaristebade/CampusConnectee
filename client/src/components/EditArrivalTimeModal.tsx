import { Form, message, Modal, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useEditArrivalTime } from '../api'
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
                        message.success(
                            "L'heure d'arrivée a été modifiée avec succès"
                        )
                    },
                    onError() {
                        message.error(
                            "Une erreur s'est produite lors de la modification de l'heure d'arrivée"
                        )
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
