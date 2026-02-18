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
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required."
            });
        }
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
        const userData = newUser[0].toObject();
        delete userData.password;
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            data: {
                token,
                user:userData,
            }
        });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try{
        console.log(req.body);
        const { email, password } = req.body;
        const existingUser = await User.findOne({email}).select("+password").session(session);

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
        const token = await jwt.sign({userId: existingUser._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        await session.commitTransaction();
        session.endSession();
        const userData = existingUser.toObject();
        delete userData.password;

        res.status(200).json({
            success: true,
            message: "Logged in sucessfully",
            data: {
                data: token,
                user:userData,
            }
        })


    }catch(error){
        next(error);
    }
}

// export const signOut = async (req, res, next) => {}
