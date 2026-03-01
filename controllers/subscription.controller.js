import { workFlowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js'; 
import { SERVER_URL } from '../config/env.js'

export const createSubscripton = async (req, res, next) =>{
    try{
        const subscriptionData = await Subscription.create({
        ...req.body,
        user:req.user._id
    });

    const {workflowRunId} = await workFlowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: {subscriptionId: subscriptionData._id},
        headers: {'Content-Type': 'application/json'},
        retries: 0,
    })

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

export const deleteSubscription = async (req, res, next) => {
    try{
        const {subscriptionId, userId} = req.params;
        if (req.user._id.toString() !== userId) {
            const error = new Error("Unauthorized: You can only delete your own subscriptions.");
            error.status = 401;
            throw error;
        }
        const deletedSubscription = await Subscription.findOneAndDelete({ 
            _id: subscriptionId, 
            user: userId 
        });

        if (!deletedSubscription) {
            const error = new Error("Subscription not found or already deleted.");
            error.status = 404;
            throw error;
        }

        res.status(200).json({success:true, message:"Subscription deleted successfully"});
    }catch(e){
        next(e)
    }
}

export const cancelSubscription = async (req, res, next) => {
    try{
        const {subscriptionId, userId} = req.params;
        if (req.user._id.toString() !== userId) {
            const error = new Error("Unauthorized: You can only cancel your own subscriptions.");
            error.status = 401;
            throw error;
        }
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            { status: 'inactive' }, 
            { new: true, runValidators: true } 
        );

        if (!updatedSubscription) {
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: updatedSubscription });
    }catch(e){
        next(e);
    }
    
}

