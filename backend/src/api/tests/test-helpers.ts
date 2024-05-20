import request from "supertest";


import { Category, User } from "../models";
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

export const loginUser = async (userId: string, userEmail: string) => {
    const user = await User.findOne({_id: userId, email: userEmail});
    if(!user) { return;}
    const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({username: user.username, email: userEmail, password: user.password  });
      // @ts-ignore
    const authToken: string = loginResponse.headers['set-cookie'].find(cookie => cookie.includes('auth-token')).split('=')[1];
    
    
    return authToken;
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