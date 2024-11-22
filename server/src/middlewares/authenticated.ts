import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'

export const authenticated = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let token = (req as any).cookies['ccpn_token'];
    // console.log("Token récupéré depuis les cookies:", token);  // Log du token pour le débogage

    if (!token) {
        token = (req as any).headers['authorization']?.split(' ')[1];
        // console.log("Token récupéré depuis les headers:", token);  // Log du token pour le débogage

        if (!token) {
            return res.status(401).send({ success: false, msg: 'Accès Non autorisé' });
        }
    }

    try {
        (req as any).user = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
        next();
    } catch (err) {
        // console.error("Erreur lors de la vérification du token:", err);
        return res.status(400).send({ success: false, msg: 'Token invalide' });
    }
}

