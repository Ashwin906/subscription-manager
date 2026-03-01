import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createSubscripton, getUserSubscriptions, getAllSubscription, getSubscriptionById, deleteSubscription, cancelSubscription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscription)

subscriptionRouter.post('/', authMiddleware, createSubscripton)

subscriptionRouter.put('/:id', getSubscriptionById)

subscriptionRouter.delete('/:subscriptionId/user/:userId', authMiddleware, deleteSubscription)

subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions )

subscriptionRouter.put('/:subscriptionId/user/:userId', authMiddleware, cancelSubscription)

export default subscriptionRouter;