import {
    Button,
    Col,
    Layout,
    Result,
    Row,
    Spin,
    Statistic,
    Typography,
} from 'antd'
import React from 'react'
import { AttendanceChart } from '../components'
import { useChartData, useStatistics } from '../api'

const { Title } = Typography
const { Content } = Layout
export const DashboardHome = () => {
    const { data: chartData, isLoading: chartDataLoading } = useChartData()

    const {
        data: statistics,
        error: statisticsError,
        isLoading: statisticsLoading,
    } = useStatistics()

    const handleRetry = () => {
        window.location.reload()
    }

    if (statisticsLoading || chartDataLoading) {
        return (
            <Content className=" min-h-screen flex justify-center items-center">
                <Spin size="large" />
            </Content>
        )
    }

    if (statisticsError) {
        return (
            <Content className=" min-h-screen flex justify-center items-center">
                <Result
                    title="Oups une erreur s'est produite"
                    extra={
                        <Button type="primary" onClick={handleRetry}>
                            Rechargez la page
                        </Button>
                    }
                />
            </Content>
        )
    }

    return (
        <div>
            <Title className="mb-8" level={3}>
                Dashboard
            </Title>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Statistic
                        className="bg-white p-4 rounded"
                        value={statistics?.data.total_student}
                        title="Nombre total d'élève"
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        className="bg-white p-4 rounded"
                        value={statistics?.data.daily_student}
                        title="Nombre d'élève présent aujourd'hui"
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        className="bg-white p-4 rounded"
                        value={statistics?.data.presence_rate}
                        suffix="%"
                        title="Taux de présence journalier"
                    />
                </Col>

                <Col span={24}>
                    <AttendanceChart
                        series={chartData.series}
                        options={chartData.options}
                    />
                </Col>
            </Row>
        </div>
    )
}
