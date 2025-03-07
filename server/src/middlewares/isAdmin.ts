import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<unknown> => {
    try {
        let admin = (req as any).user.user

        if (!admin.permissions.includes('Administrator')) {
            return res.status(401).send('Unauthorized')
        }

        next()
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}
