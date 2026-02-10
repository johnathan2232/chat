import { generateToken } from "../lib/utils.js";
import User from "../models/Users.js";
import bcrypt from "bcryptjs";

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