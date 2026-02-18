import {Router} from "express";
import {getUsers, getUser} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/',authMiddleware,getUsers )
userRouter.get('/:id',authMiddleware,getUser )


export default userRouter;

