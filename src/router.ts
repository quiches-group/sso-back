import { Application, Router } from 'express';
import {
    getApplicationKeys, getApplicationOwners,
    getOwnedApplications, getUserApplications,
    postGenerateApplicationKey,
    putApplicationRoute,
} from './controllers/applicationController';
import { getMe, putUserRoute } from './controllers/userController';
import { postLoginRoute, postRefreshTokenRoute } from './controllers/authenticationController';
import middlewares from './services/middlewares';

const publicRouter: Router = Router();
const adminRouter: Router = Router();

//  Users [PUBLIC]
publicRouter.put('/users', putUserRoute);
publicRouter.get('/users/me', [middlewares.isAuthenticated], getMe);

//  Application [ADMINISTRATION]
adminRouter.put('/applications', [middlewares.isAuthenticated], putApplicationRoute);
adminRouter.get('/applications', [middlewares.isAuthenticated], getUserApplications);
adminRouter.get('/applications', getOwnedApplications);
adminRouter.get('/application/:applicationId/owners', [middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationOwners);
adminRouter.get('/applications/:applicationId/keys', [middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationKeys);
adminRouter.post('/applications/:applicationId/generate-keys', [middlewares.applicationExists, middlewares.isApplicationOwner], postGenerateApplicationKey);

//  Security [PUBLIC]
publicRouter.post('/login', postLoginRoute);
publicRouter.post('/refresh', postRefreshTokenRoute);

const routerPub = (): Router => publicRouter;
const routerAdmin = (): Router => adminRouter;

export const useRouters = (app: Application): void => {
    app.use('/api', routerPub());
    app.use('/api/administration', [middlewares.isAuthenticated], routerAdmin());
};
