import {CookieOptions} from "express";

export const getCookieOptions = (useSecureAuth : boolean) : CookieOptions => {
    return  {
        maxAge: 31 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: useSecureAuth,
        domain: process.env.COOKIE_DOMAIN,
        sameSite: 'none',
    };
}
