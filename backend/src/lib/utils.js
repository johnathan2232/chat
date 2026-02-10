import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
    const {JWT_SECRET} = ENV;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({userId}, ENV.JWT_SECRET, {expiresIn: "30d"});
    //jwt.sign() is a method provided by the jsonwebtoken library that is used to create a JSON Web Token (JWT).
    //The first argument is the payload, which is an object that contains the data you want to include in the token. In this case, we are including the userId.
    //The second argument is the secret key, which is used to sign the token and verify its authenticity. We are using an environment variable called JWT_SECRET to store our secret key.
    //The third argument is an options object where we can specify additional settings for the token. In this case, we are setting the expiresIn option to "30d", which means that the token will expire after 30 days.
    res.cookie("jwt", token, {
        httpOnly: true, //httpOnly means that the cookie cannot be accessed by client-side JavaScript, 
        // which helps to prevent cross-site scripting (XSS) attacks.
        secure: ENV.NODE_ENV === "production", //https in production, http in development s stands for secure, 
        // meaning that the cookie will only be sent over secure (HTTPS) connections.
        sameSite: "strict", //sameSite: "strict" means that the cookie will only be sent in requests 
        // originating from the same site, which helps to prevent cross-site request forgery (CSRF) attacks.
        maxAge: 30 * 24 * 60 * 60 * 1000 //30 days in milliseconds 
    });
    return token;
};