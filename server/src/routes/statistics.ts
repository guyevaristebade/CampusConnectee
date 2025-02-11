import { Router, Request, Response } from 'express'
import { getAttendanceStats, getChartData } from '../controllers'
import { ResponseType } from '../types'
import { Attendance } from '../models'
import moment from 'moment'

export const StatisticsRouter: Router = Router()

// StatisticsRouter.get('/chart-data', async (req: Request, res: Response) => {
//     const response: ResponseType = await getChartData()
//     res.status(200).send(response)
// })

StatisticsRouter.get(
    '/weekly-attendance',
    async (req: Request, res: Response) => {
        const response = await getAttendanceStats()
        res.status(response.status as number).send(response)
    }
)
