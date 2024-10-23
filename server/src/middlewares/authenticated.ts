import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'

export const authenticated = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let token = (req as any).cookies['farm-token']

    if (!token) {
        token = (req as any).headers.bearer

        if (!token) {
            return res.status(401).send({ success: false, msg: 'Accès Non autorisé' })
        }
    }

    try {
        (req as any).user = jwt.verify(token, process.env.JWT_SECRET || '')
        next()
    } catch (err) {
        return res.status(400).send({ success: false, msg: 'Token invalide' })
    }
}
