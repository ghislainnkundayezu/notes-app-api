import bcrypt from "bcrypt";

import { IUser } from "../interfaces/Schemas";
import { PreSaveMiddlewareFunction, CallbackError } from "mongoose";

type HookNextFuction = (error?: CallbackError) => void;

/**
 * hashes the password.
 * @param {HookNextFunction} next - the callback to call after the middle is done executing.
 * @returns {Promise<void>} - returns a promise that resolves after the middleware completes hashing the password.
 */
export const hashPassword: PreSaveMiddlewareFunction<IUser>  =  async function(next: HookNextFuction): Promise<void>{
    
    // generate a hashed password before saving it to the database.
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }

    next();

};