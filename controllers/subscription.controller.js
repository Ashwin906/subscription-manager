import Subscription from '../models/subscription.model.js'; 

export const createSubscripton = async (req, res, next) =>{
    try{
        const subscriptionData = await Subscription.create({
        ...req.body,
        user:req.user._id
    });

    res.status(201).json({success:true, data:subscriptionData});
    } catch(e){
        next(e);
    }
    
}

export const getUserSubscriptions = async (req, res, next) =>{
    try{
        if(req.user._id !== req.params.id){
            const error = new Error("Unauthorized: You are not  allowed to access this resource");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user:req.params.id});
        res.status(200).json({success:true, data:subscriptions});
    } catch(e){
        next(e);
    }
}

export const getAllSubscription = async (req, res, next) => {
    try{
        const allSubscriptions = await Subscription.find({});
        
        res.status(200).json({success:true, data:allSubscriptions});
    }
    catch(e){
        next(e);
    }
}

export const getSubscriptionById = async (req, res, next) => {
    try{
        const subscriptionData = await Subscription.findOne({_id:req.params.id});

        if(!subscriptionData){
            const error = new Error("Data doesn't exists!")
            error.status = 404;
            throw error;
        }
        
        res.status(200).json({success:true, data:subscriptionData});

    } catch(e){
        next(e);
    }
}