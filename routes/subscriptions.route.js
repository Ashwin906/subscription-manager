import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createSubscripton, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({body:{message:"Get all subscriptions"}});
})

subscriptionRouter.get('/:id', (req, res) => {
    res.send({body:{message:"Get subscriptions by id"}});
})

subscriptionRouter.post('/', authMiddleware, createSubscripton)

subscriptionRouter.put('/:id', (req, res) => {
    res.send({body:{message:"Update subscription"}});
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({body:{message:"Delete subscription"}});
})

subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions )

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({body:{message:"Cancel Subscription"}});
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({body:{message:"Get upcoming renewals"}});
})

export default subscriptionRouter;