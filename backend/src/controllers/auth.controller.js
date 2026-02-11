import { generateToken } from "../lib/utils.js";
import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    //app.use(express.json()) is used to parse the incoming request body as JSON, allowing us to access the data sent by the client in the req.body object.
    //In this case, we are extracting the fullName, email, and password fields from the request body, which are expected to be sent by the client when they are signing up for an account.
    //This allows us to use these values to create a new user in our database or perform any necessary validation before proceeding with the signup process.
    try 
    {
        //First check that the user filled all fields and its valid
        if(!fullName || !email || !password)
        {
            return res.status(400).json({message: "Please fill all fields"});
            //400 means bad request
        }
        if (password.length < 5)
        {
            return res.status(400).json({message: "Password must be at least 5 characters long"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
        {
            return res.status(400).json({message: "Please enter a valid email address"});
        }
        //the regex part means that the email should not contain spaces, should have an @ symbol, 
        // and should have a dot after the @ symbol with some characters following it. 
        const user  = await User.findOne({email});
        //looks for a user with the same email in the database, 
        // if it finds one, it means that the email is already in use and we cannot create a new user with the same email.
        if(user)
        {
            return res.status(400).json({message: "Email already in use"});
        }
        //if it doesn't find a user we can continue and hash the password using bcrypt 
        // and then create a new user in the database with the provided fullName, email, and hashed password.
        //pass: 1234556 -> $lkajsj_`183
        const salt = await bcrypt.genSalt(10); //how long the string is once hashed, the longer the salt, 
        // the more secure the hash is, but it also takes more time to generate and verify the hash.
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
    if (newUser)
    {
        const savedUser = await newUser.save();
        generateToken(savedUser._id, res)
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });
        //201 means created successfully   200 means success
        try
        {
            await sendWelcomeEmail(email, fullName, ENV.CLIENT_URL);
        } 
        catch(error)
        {
            console.error("Error sending welcome email: ", error);
        }
    }
    else
    {
        res.status(400).json({message: "Invalid user data"});
    }
    } catch (error) {
        console.error("Error in signup controller: ", error);
        res.status(500).json({message: "Server error"});

    }
}
export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password)
    {
        return res.status(400).json({message: "Please fill all fields"});
    }
    try{
        const user = await User.findOne({email});
        if (!user)
        {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        //bcrypt.compare() is a method provided by the bcrypt library that is 
        // used to compare a plaintext password with a hashed password. 
        //It takes two arguments: the first is the plaintext password that the 
        // user is trying to log in with, and the second is the hashed password that is stored 
        // in the database for that user.
        if (!isPasswordCorrect)
        {
            return res.status(400).json({message: "Invalid credentials"});
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch(error)
    {
        console.error("Error in login controller: ", error);
        res.status(500).json({message: "Server error"});
    }
};
export const logout = (req, res) => {
    //we don't use request here because we are not doing anything with the request, 
    // we are just clearing the cookie that contains the JWT token.
    //What does request even do? 
    //The request object in Express.js contains information about the HTTP request that was 
    // made to the server, such as the request headers, query parameters, and body data.
    //In the logout function, we don't need to access any of this information 
    // because we are simply clearing the cookie that contains the JWT token.
    res.cookie("jwt", "", {maxAge:0});
    //matches what's in utils.js, we set the cookie name to "jwt" and here we are 
    // clearing it by calling res.cookies("jwt") without providing a value or options.
    res.status(200).json({message: "Logged out successfully"});
};
export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        if(!profilePic)
        {
            return res.status(400).json({message: "Profile picture is required"});
        }
        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new: true}
        );
        res.status(200).json(updateUser);
    }catch(error)
    {
        console.error("Error in updateProfile controller: ", error);
        res.status(500).json({message: "Server error"});
    }
};