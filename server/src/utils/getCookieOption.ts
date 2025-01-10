import { CookieOptions } from 'express'

export const getCookieOptions = (): CookieOptions => {
    const useSecureAuth: boolean = process.env.NODE_ENV !== 'development'
    return {
        maxAge: 31 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: useSecureAuth,
        domain: process.env.COOKIE_DOMAIN,
        sameSite: useSecureAuth ? 'none' : 'lax',
    }
}
