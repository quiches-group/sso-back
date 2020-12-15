import { Application, Router } from 'express';
import {
    getOwnedApplications,
    postGenerateApplicationKey,
    putApplicationRoute
} from './controllers/applicationController';
import { putUserRoute } from './controllers/userController';
import { postLoginRoute, postRefreshTokenRoute } from './controllers/authenticationController';
import middlewares from './services/middlewares';

const publicRouter: Router = Router();
const adminRouter: Router = Router();

publicRouter.put('/users', putUserRoute);

//  Application
publicRouter.put('/applications', putApplicationRoute);
// publicRouter.get('/applications', putApplicationRoute);
adminRouter.post('/applications/:applicationId/generate-keys/', postGenerateApplicationKey);
adminRouter.get('/applications/', getOwnedApplications);

//  Security
publicRouter.post('/login', postLoginRoute);
publicRouter.post('/refresh', postRefreshTokenRoute);

const routerPub = (): Router => publicRouter;
const routerAdmin = (): Router => adminRouter;

export const useRouters = (app: Application): void => {
    app.use('/api', routerPub());
    app.use('/api/administration', [middlewares.isAuthenticated], routerAdmin());
};
