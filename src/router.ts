import { Application, Router } from 'express';
import {
    getApplicationKeys,
    getOwnedApplications, getUserApplications,
    postGenerateApplicationKey,
    putApplicationRoute,
} from './controllers/applicationController';
import { putUserRoute } from './controllers/userController';
import { postLoginRoute, postRefreshTokenRoute } from './controllers/authenticationController';
import middlewares from './services/middlewares';

const publicRouter: Router = Router();
const adminRouter: Router = Router();

//  Users [PUBLIC]
publicRouter.put('/users', putUserRoute);

//  Application [PUBLIC]
publicRouter.put('/applications', putApplicationRoute);
publicRouter.get('/applications', [middlewares.isAuthenticated], getUserApplications);

//  Application [ADMINISTRATION]
adminRouter.post('/applications/:applicationId/generate-keys', [middlewares.userIsOwnerOfApplication], postGenerateApplicationKey);
adminRouter.get('/applications/:applicationId/keys', [middlewares.userIsOwnerOfApplication], getApplicationKeys);
adminRouter.get('/applications', getOwnedApplications);

//  Security [PUBLIC]
publicRouter.post('/login', postLoginRoute);
publicRouter.post('/refresh', postRefreshTokenRoute);

const routerPub = (): Router => publicRouter;
const routerAdmin = (): Router => adminRouter;

export const useRouters = (app: Application): void => {
    app.use('/api', routerPub());
    app.use('/api/administration', [middlewares.isAuthenticated], routerAdmin());
};
