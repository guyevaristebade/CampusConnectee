import moment from 'moment'
import { NextFunction, Request, Response } from 'express'
export const timeRestriction = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const now = moment() // Heure actuelle
    const currentHour = now.hours()
    const currentMinute = now.minutes()

    // Définir les plages horaires interdites
    const startRestriction = moment().hours(17).minutes(31) // 17h30
    const endRestriction = moment().hours(8).minutes(29).add(1, 'day') // 8h30 le lendemain

    // Vérifier si on est dans la plage interdite
    const isWithinRestriction =
        (now.isSameOrAfter(startRestriction) &&
            now.isBefore(moment().endOf('day'))) || // Entre 17h31 et 23h59
        (now.isSameOrAfter(moment().startOf('day')) &&
            now.isBefore(endRestriction)) // Entre 00h00 et 8h29

    if (isWithinRestriction) {
        return res.status(403).send({
            success: false,
            msg: 'Vous ne pouvez pas effectuer cette action en dehors des heures du campus',
        })
    }

    next() // Passer à la suite si hors des plages interdites
}
