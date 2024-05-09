import { Types, Document } from "mongoose";

// defines the types of fields in the Document of the Users collection.
interface IUser extends Document {
    username: string,
    email: string,
    password: string,
}

// defines the types of fields in the Document of the Notes collection.
interface INote extends Document {
    title: string,
    details: string,
    createAt: Date,
    status: string,
    owner: Types.ObjectId,
    category: Types.ObjectId,
}

// defines the types of fields in the Document of the Categories collection.
interface ICategory extends Document {
    label: string,
    owner: Types.ObjectId,
    notes: Types.ObjectId[],
}


// export those interfaces.
export {
    IUser,
    INote, 
    ICategory,
}