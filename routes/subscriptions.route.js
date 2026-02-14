import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({body:{message:"Get all subscriptions"}});
})

subscriptionRouter.get('/:id', (req, res) => {
    res.send({body:{message:"Get subscriptions by id"}});
})

subscriptionRouter.post('/', (req, res) => {
    res.send({body:{message:"Create new subscription"}});
})

subscriptionRouter.put('/:id', (req, res) => {
    res.send({body:{message:"Update subscription"}});
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({body:{message:"Delete subscription"}});
})

subscriptionRouter.get('/user/:id', (req, res) => {
    res.send({body:{message:"Get all subscriptions of User"}});
})

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({body:{message:"Cancel Subscription"}});
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({body:{message:"Get upcoming renewals"}});
})

export default subscriptionRouter;