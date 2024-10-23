import express, {Router, Request, Response} from 'express'
import {CreateUser} from "../controllers";
import {ResponseType} from "../types";
import { sanitizeFilter} from 'mongoose'
import {authenticated} from "../middlewares";
import {User} from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {getCookieOptions} from "../utils";

const useSecureAuth : boolean = process.env.NODE_ENV !== 'development';

export const UserRouter : Router = express.Router();


UserRouter.post('/register', async (req : Request, res: Response) => {
    const response: ResponseType = await CreateUser(req.body)
    res.send(response);
})

UserRouter.post('/login', async (req: Request, res: Response) => {
    let response: ResponseType = {
        success: true,
    };

    const { password, username } = req.body;

    try {
        if (!username || !password) {
            response.status = 400;
            response.success = false;
            response.msg = 'Veuillez remplir tous les champs avant la validation';
            return res.send(response);
        }

        const user = await User.findOne(sanitizeFilter({ username }));
        if (!user) {
            response.status = 401;
            response.success = false;
            response.msg = "Utilisateur introuvable";
            return res.send(response);
        }

        const validPass = await bcrypt.compare(password, (user as any).password);
        if (!validPass) {
            response.status = 401;
            response.success = false;
            response.msg = "Mot de passe invalide";
            return res.send(response);
        }

        const { password: _, ...tokenContent } = user.toObject();
        const token: string = jwt.sign({ id: (user as any)._id }, process.env.JWT_SECRET || '', { expiresIn: '30d' });

        res.cookie('farm-token', token, getCookieOptions(useSecureAuth));

        response.data = { user: tokenContent, token };
        response.status = 200

        return res.send(response);
    } catch (e : any) {
        response.status = 500;
        response.success = false;
        response.msg = `Erreur serveur : ${e.message}`;
        return res.send(response);
    }
});

UserRouter.get('/', authenticated, async (req, res) => {
    let response : ResponseType = {
        success: true,
    };

    const token = req.cookies['farm-token'];

    if (token) {
        response.data = { user: (req as any).user, token };
        response.status = 200;
    }

    res.send(response);
});

UserRouter.delete('/', authenticated, (req: Request, res: Response) => {
    const response: ResponseType = {
        success: true,
    }

    res.cookie('farm-token', '', {
        maxAge: -100,
    })

    return res.send(response)
})
