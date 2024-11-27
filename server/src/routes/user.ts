import express, {Router, Request, Response} from 'express';
import {CreateUser, loginUser} from "../controllers";
import {ResponseType} from "../types";
import {authenticated} from "../middlewares";



export const UserRouter : Router = express.Router();

UserRouter.post('/register',async (req : Request, res: Response) => {
    const response: ResponseType = await CreateUser(req.body)
    res.status(response.status as number).send(response);
})

UserRouter.post('/login' , async (req: Request, res: Response) => {

    const useSecureAuth : boolean = process.env.NODE_ENV !== 'development';

    if (!req.body.username || !req.body.password) {
        return res.status(400).send({success: false, msg: "Veuillez remplir tous les champs avant la validation", status : 400});
    }

    const response : ResponseType  = await loginUser(req.body);
    if (response.success) {
        const token = response.data.token;
        res.cookie('token_ccpn', token, {
            maxAge: 31 * 24 * 3600 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            // domain: process.env.COOKIE_DOMAIN,
            domain: "campus-connecte-nemours.vercel.app",
        });
    }

    res.status(response.status as number).send(response);
});


// Middleware qui permet de vérifier si l'utilisateur est authentifié 
UserRouter.get('/', authenticated, async (req, res) => {
    const token = req.cookies.token_ccpn;
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
    res.cookie('token_ccpn', '', {
        maxAge: -100,
    })
    return res.send({ success : true , msg : 'déconnecté' });
})

