import { Card } from 'antd'
import React from 'react'
import Chart from 'react-apexcharts'
import { useChartData } from '../api'

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

export const Barchart: React.FC<ChartState> = ({ options, series }) => {
  const { data: chartData } = useChartData()

  console.log(chartData)
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
