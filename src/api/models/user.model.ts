import mongoose, { Types, Document, Schema } from "mongoose";

import { IUser } from "../interfaces/Schemas";
import { hashPassword } from "../helpers/db_middlewares";

// define the schema for the User document in the 'users' collection.
const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    
});

// middlewares.

// Apply the hashPassword middleware to the UserSchema for the 'save' operation.
UserSchema.pre<IUser>('save', hashPassword);


// create a Mongoose model from the UserSchema for the 'users' collection.
const User = mongoose.model("User", UserSchema, "users");


// export the User model.
export default User;