import { NextFunction, Request, Response } from "express";
import axios from "axios";

/**
 * Ce middleware permet de vérifier si l'étudiant est bien sur le campus
 * Elle utilise une api qui permet d'avoir l'adresse Ip actuelle de l'étudiant
 * puis la compare à celle du campus
 * Si l'étudiant est sur le campus l'accès lui sera autorisé
 * dans le cas contaire l'accès lui est refusé
 * */
export const verifyIp = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await axios.get(process.env.URL_GET_STUDENT_IP as string);
        const ip = response.data;

        // Vérification de l'adresse IP
        if (ip !== process.env.CAMPUS_IP_ADDRESS) {
            return res.status(401).send({success: false, msg: 'Accès non autorisé'});
        }

        next();
    } catch (error) {
        return res.status(400).send({
            success: false,
            msg: 'Erreur lors de la vérification de l\'IP, vous devez être sur le campus'
        });
    }
}
