import request from "supertest";


import { Category, Note, User } from "../models";
import server from "../../config/server";

export const createUser = async () => {
    const testUser = new User({
        username: "test",
        email: 'test@example.com',
        password: 'password123',
        // Add any other necessary user data
      });
      await testUser.save();

    const userId = testUser._id;
    const userEmail = testUser._id;

    return { userId, userEmail }
}



export const createTestCategory = async (owner: string) => {

    const userId = owner;

    const testCategory = new Category({
        label: "Good",
        owner: userId,
    })

    await testCategory.save();

    const categoryId = testCategory._id;

    return categoryId;
}

export const createTestNote = async (owner: string) => {

    const userId = owner;

    const testNote = new Note({
        title: "Good",
        owner: userId,
    })

    await testNote.save();

    const noteId = testNote._id;

    return noteId;
}