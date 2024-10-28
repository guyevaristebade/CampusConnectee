import bcrypt from "bcryptjs";
import {IUser, ResponseType} from "../types";
import {User} from "../models";
import {sanitizeFilter} from "mongoose";
import {passwordValidators} from "../utils";

export const CreateUser = async (userData : IUser): Promise<ResponseType> => {
    let response: ResponseType = {
        success : true
    }

    try {
        let user = await User.findOne(sanitizeFilter({ name: userData.username }));
        if (user) {
            response.status = 400
            response.success = false
            response.msg = 'Un utilisateur existe déjà a ce nom'
            return response;
        }

        let validation = passwordValidators(userData.password);
        for (const el of validation) {
            if (!el.validator) {
                response.status = 400
                response.success = false
                response.msg = el.message
                return response
            }
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User(sanitizeFilter({
            username: userData.username,
            password: hashedPassword,
        }));

        await newUser.save();

        const {password, ...newUserWithPasswd} = newUser.toObject();
        response.msg = "Inscription réussie avec succès";
        response.data = newUserWithPasswd
    } catch (e : any) {
        response.status = 500
        response.success = false;
        response.msg = e.message
    }
    return  response;
};

