import mongoose, { Types, Document, Schema } from "mongoose";
import { ICategory } from "../interfaces/Schemas";

// define the schema for the Category document in the 'categories' collection.
const CategorySchema = new Schema<ICategory>({
    label: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// create a Mongoose model from the CategorySchema for the 'categories' collection.
const Category = mongoose.model("Category", CategorySchema, "categories");

//export the Category model.
export default Category;