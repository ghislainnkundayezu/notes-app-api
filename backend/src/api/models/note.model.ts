import mongoose, { Types, Document, Schema } from "mongoose";

import { INote } from "../interfaces/Schemas";


// define the schema for the Note document in the 'notes' collection.
const NoteSchema = new Schema<INote>({
    title: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    details: {
        type: String,
        default: "",
        trim: true,
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        default: "ongoing",
        enum: ["ongoing", "complete"],
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    }
});

// create a Mongoose model from the NoteSchema for the 'notes' collection.
const Note = mongoose.model<INote>("Note", NoteSchema, "notes");

// export the Note model.
export default Note;