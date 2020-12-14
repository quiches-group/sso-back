import { Router } from 'express';
import { putApplication } from './controllers/applicationController';
import { putUser } from './controllers/userController';

const publicRouter: Router = Router();

publicRouter.put('/users', putUser);

export const router = (): Router => publicRouter;
