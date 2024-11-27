import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: 'Trop de tentatives de connexion, veuillez réessayer dans une minute.',
});