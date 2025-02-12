import { Card } from 'antd'
import React from 'react'
import Chart from 'react-apexcharts'

interface ChartOptions {
  xaxis: {
    name: string
    categories: string[]
  }
}

interface ChartSeries {
  name: string
  data: number[]
}

export interface ChartState {
  options: ChartOptions
  series: ChartSeries[]
}

export const AttendanceChart: React.FC<ChartState> = ({ options, series }) => {
  return (
    <Card title="Présences hebdomadaires" style={{ marginBottom: 20 }}>
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height="400"
      />
    </Card>
  )
}
