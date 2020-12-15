import { Application, Router } from 'express';
import {
    getAllApplication,
    getApplicationKeys, getApplicationOwners, getApplicationUsers,
    getOwnedApplications, getAuthorizedApplications,
    postGenerateApplicationKey,
    putApplicationRoute, postPromoteApplicationOwner, postDowngradeApplicationOwner,
} from './controllers/applicationController';
import { getMe, putUserRoute } from './controllers/userController';
import {
    postAuthorizeUserApplication,
    postLoginRoute,
    postRefreshTokenRoute, postRevokeAuthorizedApplication,
} from './controllers/authenticationController';
import middlewares from './services/middlewares';

const publicRouter: Router = Router();

//  Users [PUBLIC]
publicRouter.put('/users', putUserRoute);
publicRouter.get('/users/me', [middlewares.isAuthenticated], getMe);

//  Application [ADMINISTRATION]
publicRouter.put('/applications', [middlewares.isAuthenticated], putApplicationRoute);
publicRouter.get('/applications', [middlewares.isAuthenticated, middlewares.isAdmin], getAllApplication);
publicRouter.get('/applications/authorized', [middlewares.isAuthenticated], getAuthorizedApplications);
publicRouter.get('/applications/owned', [middlewares.isAuthenticated], getOwnedApplications);
publicRouter.get('/application/:applicationId/owners', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationOwners);
publicRouter.post('/application/:applicationId/promote/:userId', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], postPromoteApplicationOwner);
publicRouter.post('/application/:applicationId/downgrade/:userId', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], postDowngradeApplicationOwner);
publicRouter.get('/application/:applicationId/users', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationUsers);
publicRouter.get('/applications/:applicationId/keys', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationKeys);
publicRouter.post('/applications/:applicationId/keys', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], postGenerateApplicationKey);

//  Security [PUBLIC]
publicRouter.post('/login', postLoginRoute);
publicRouter.post('/refresh', postRefreshTokenRoute);
publicRouter.post('/authorize/:applicationId', [middlewares.isAuthenticated, middlewares.applicationExists], postAuthorizeUserApplication);
publicRouter.post('/revoke/:applicationId', [middlewares.isAuthenticated, middlewares.applicationExists], postRevokeAuthorizedApplication);

const routerPub = (): Router => publicRouter;

export const useRouters = (app: Application): void => {
    app.use('/api', routerPub());
};
