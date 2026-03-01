import { sendReminder } from "../controllers/workflow.controller.js";
import { Router } from 'express';

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminder);

export default workflowRouter;