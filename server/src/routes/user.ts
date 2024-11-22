import express, {Router, Request, Response} from 'express'
import {CreateUser} from "../controllers";
import {ResponseType} from "../types";
import { sanitizeFilter} from 'mongoose'
import {authenticated, verifyIp} from "../middlewares";
import {User} from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {getCookieOptions} from "../utils";



export const UserRouter : Router = express.Router();

UserRouter.post('/register',async (req : Request, res: Response) => {
    const response: ResponseType = await CreateUser(req.body)
    res.status(response.status as number).send(response);
})

UserRouter.post('/login' , async (req: Request, res: Response) => {
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

        const user = await User.findOne(sanitizeFilter({ username })).select("-createdAt -updatedAt -__v -iat -exp");
        if (!user) return res.status(401).send({success: false, msg: "Utilisateur introuvable", status : 401});


        const validPass = await bcrypt.compare(password, (user as any).password);
        if (!validPass) return res.status(401).send({success: false, msg: "Mot de passe invalide", status : 401});
        
        const { password : _ , ...tokenContent } = user.toObject();
        const token: string = jwt.sign({ user : tokenContent  }, process.env.JWT_SECRET_KEY || '', { expiresIn: '30d' });

        console.log("Token généré:", token);  // Vérification du token
        res.cookie('token-ccpn', token, getCookieOptions());

        return res.status(200).send({success: true, status : 200, data :  { user : tokenContent , token }});

    } catch (e : any) {
        return res.status(500).send({success: false, status : 500, msg : e.message});
    }
});


// Middleware qui permet de vérifier si l'utilisateur est authentifié 
UserRouter.get('/', authenticated, async (req, res) => {
    const token = req.cookies['token-ccpn'];
    const user = (req as any).user;
    return res.status(200).send({
        success: true,
        data: {
            user : {
                _id : user.user._id,
                username : user.user.username,
                permissions : user.user.permissions
            }, 
            token
        }
    });
});

// Route pour la déconnexion de l'utilisateur
UserRouter.delete('/logout', authenticated, (req: Request, res: Response) => {
    res.cookie('token-ccpn', '', {
        maxAge: -100,
    })
    return res.send({ success : true , msg : 'déconnecté' });
})

