import { NextFunction, Request, Response } from "express";
import axios from "axios";

/**
 * Middleware pour vérifier l'adresse IP de l'utilisateur.
 *
 * Cette fonction effectue les actions suivantes :
 * 1. Effectue une requête HTTP pour récupérer l'adresse IP de l'utilisateur.
 * 2. Compare cette adresse IP à l'adresse IP autorisée (définie par `CAMPUS_IP_ADDRESS`).
 * 3. Si l'adresse IP ne correspond pas, renvoie une réponse 401 (Accès non autorisé).
 * 4. Si l'adresse IP est correcte, passe au middleware suivant dans la chaîne.
 *
 * En cas d'erreur lors de la récupération de l'adresse IP, renvoie une réponse 400
 * avec un message d'erreur approprié.
 * */

export const verifyIp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const link = process.env.GEOLOCATION_API_LINK as string;
    const response = await axios.get(link);
    const ip = response.data.ip;
    const lng = response.data.location.lng;
    const lat = response.data.location.lat;

    // Vérification de l'adresse IP
    if (
      ip !== process.env.CAMPUS_IP &&
      lng !== process.env.CAMPUS_LNG &&
      lat !== process.env.CAMPUS_LAT
    ) {
      return res.status(401).send({
        success: false,
        msg: "Accès non autorisé, vous n'êtes pas sur le campus",
        tes:
          ip !== process.env.CAMPUS_IP &&
          lng !== process.env.CAMPUS_LNG &&
          lat !== process.env.CAMPUS_LAT,
      });
    }

    next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      msg: "Erreur lors de la vérification de l'IP, vous devez être sur le campus",
    });
  }
};
