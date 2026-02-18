import jwt from "jsonwebtoken"
import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try{
        let token;
        console.log(req.user);
        if( req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const decoded = jwt.verify(token,JWT_SECRET);

        const user = await User.findById(decoded.userId);
        req.user = user;
        next();
    }
    catch(error){
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        res.status(401).json({message:`Unauthorized : ${error.message}`})
    }
}
export default authMiddleware;