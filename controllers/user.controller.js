import User from "../models/user.model.js"

export const getUsers = async (req, res, next) => {
    try{
        const user = await User.find();

        res.status(200).json({
            success:true,
            data:user,
        });
    }catch(error){
        next(error);
    }
}

export const getUser = async (req, res, next ) =>{
    try{
        const user = await User.findOne({_id:req.params.id}).select("-password");
        if(!user){
            const error = new Error("User doesn't exists");
            res.statusCode = 401;
            throw error;
        }
        res.status(200).json({
            success:true,
            message: "User data fetched successfully",
            data: user,
        });
    }catch(error){
        next(error);
    }
}