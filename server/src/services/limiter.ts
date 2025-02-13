import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes, veuillez réessayer dans 15 minutes.',
})

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message:
        'Trop de tentatives de connexion, veuillez réessayer dans une minute.',
})
