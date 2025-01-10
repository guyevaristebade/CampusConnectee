import { Router, Request, Response } from 'express'
import { getChartData } from '../controllers'
import { ResponseType } from '../types'

export const StatisticsRouter: Router = Router()

StatisticsRouter.get('/chart-data', async (req: Request, res: Response) => {
    const response: ResponseType = await getChartData()
    res.status(200).send(response)
})
