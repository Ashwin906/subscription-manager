import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {JWT_SECRET, JWT_EXPIRES_IN} from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    await session.startTransaction();

    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({ email });

        if(existingUser){
            const error = new Error('User already exists')
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{name, email, password:hashedPassword}], {session});
        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            data: {
                token,
                user:newUser[0],
            }
        });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {

    try{
        const { email, password } = req.body;
        const existingUser = User.findOne({email}).select("+password").session(session);

        if(! existingUser){
            const error = new Error("User doesn't exists");
            res.statusCode = 401;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

        if(! isPasswordMatch){
            const error = new Error("Password doesn't match");
            res.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({userId: existingUser._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Logged in sucessfully",
            data: {
                data: token,
                user:existingUser,
            }
        })


    }catch(error){
        next(error);
    }
}

// export const signOut = async (req, res, next) => {}
