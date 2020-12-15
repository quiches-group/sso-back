import { Router } from 'express';
import { putApplicationRoute } from './controllers/applicationController';
import { putUserRoute } from './controllers/userController';
import { postLoginRoute, postRefreshTokenRoute } from './controllers/authenticationController';

const publicRouter: Router = Router();

publicRouter.put('/users', putUserRoute);

publicRouter.put('/applications', putApplicationRoute);

//  Security
publicRouter.post('/login', postLoginRoute);
publicRouter.post('/refresh', postRefreshTokenRoute);

export const router = (): Router => publicRouter;
