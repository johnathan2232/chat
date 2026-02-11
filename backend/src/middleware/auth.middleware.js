import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => 
  {
    try {
      const token = req.cookies?.jwt;
      if (!token)
      {
        return res.status(401).json({message: "Unauthorized - No token"});
      }
      //401 means unauthorized
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      if(!decoded)
      {
        return res.status(401).json({message: "Unauthorized- Invalid Token"});
      }
      const user = await User.findById(decoded.id).select("-password");
      if(!user)
      {
        return res.status(404).json({message: "User not found"});
      }
      req.user = user;
      next();
    } catch(error)
    {
        console.error("Error in protectRoute middleware: ", error);
        res.status(500).json({message: "Server error"});
    }
};
