import bcrypt from 'bcryptjs'
import { IUser, ResponseType } from '../types'
import { User } from '../models'
import { sanitizeFilter } from 'mongoose'
import { passwordValidators } from '../services'
import jwt from 'jsonwebtoken'
import { Request } from 'express'

export const CreateUser = async (userData: IUser): Promise<ResponseType> => {
    let response: ResponseType = {
        success: true,
        status: 201,
    }

    try {
        let user = await User.findOne(
            sanitizeFilter({ username: userData.username })
        )
        if (user) {
            response.status = 400
            response.success = false
            response.msg = 'Un utilisateur existe déjà a ce nom'
            return response
        }

        let validation = passwordValidators(userData.password)
        for (const el of validation) {
            if (!el.validator) {
                response.status = 400
                response.success = false
                response.msg = el.message
                return response
            }
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const newUser = new User(
            sanitizeFilter({
                username: userData.username,
                password: hashedPassword,
                permissions: userData.permissions,
            })
        )

        await newUser.save()

        const { password, ...newUserWithPasswd } = newUser.toObject()
        response.msg = 'Inscription réussie avec succès'
        response.data = newUserWithPasswd
    } catch (e: any) {
        if (e.code === 11000) {
            response.status = 400
            response.success = false
            response.msg = 'Un utilisateur avec ce nom existe déjà'
        } else {
            response.status = 500
            response.success = false
            response.msg =
                "Une erreur s'est produite, veuillez contactez les développeurs"
        }
    }
    return response
}

export const loginUser = async (userData: IUser): Promise<ResponseType> => {
    let response: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        // Find user by username
        const user = await User.findOne(
            sanitizeFilter({ username: userData.username })
        )
        if (!user) {
            response.status = 400
            response.success = false
            response.msg = 'Identifiants invalides'
            return response
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            userData.password,
            user.password as string
        )
        if (!passwordMatch) {
            response.status = 400
            response.success = false
            response.msg = 'Mot de passe incorrect'
            return response
        }

        // Return user without password
        const { password, ...userWithPasswd } = user.toObject()

        // Generate token
        const token: string = jwt.sign(
            { user: userWithPasswd },
            process.env.JWT_SECRET_KEY || '',
            { expiresIn: '30d' }
        )

        response.data = { user: userWithPasswd, token }
    } catch (e: any) {
        response.status = 500
        response.success = false
        response.msg =
            "Une erreur s'est produite, veuillez contactez les développeurs"
    }
    return response
}

export const fetchAllUsers = async (req: Request): Promise<ResponseType> => {
    let response: ResponseType = {
        success: true,
        status: 200,
    }

    try {
        const users = await User.find()
            .select('-password')
            .sort({ username: 1 })
        const usersWithOutCurrentUser = users.filter(
            (user) => user.username !== (req as any).user.user.username
        )

        response.data = usersWithOutCurrentUser
    } catch (e: any) {
        response.status = 500
        response.success = false
        response.msg =
            "Une erreur s'est produite, veuillez contactez les développeurs"
    }
    return response
}
