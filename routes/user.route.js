import {Router} from "express";

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.send({body:{message: 'Fetch all users'}});
})

export default userRouter;

