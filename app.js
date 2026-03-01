import express  from "express";
import { PORT } from "./config/env.js";
import cookieParser from 'cookie-parser';

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import subscriptionRouter from "./routes/subscriptions.route.js";
import connectToDatabase from "./database/database.js";
import errorHandler from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/workflows', workflowRouter);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send({message:"Connection established successfully"});
})

app.listen(PORT, async() => {
    console.log(`App listening on port http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;

