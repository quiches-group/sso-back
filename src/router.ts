import { Application, Router } from 'express';
import {
    getApplicationKeys,
    getApplicationOwners,
    postGenerateApplicationKey,
    putApplicationRoute,
    postPromoteApplicationOwner,
    postDowngradeApplicationOwner,
    getApplicationById, getApplicationByPublicKey, deleteApplicationRoute,
} from './controllers/applicationController';
import { getMe, postUserActivation, putUserRoute } from './controllers/userController';
import {
    postLoginRoute,
    postRefreshTokenRoute,
} from './controllers/userAuthenticationController';
import { putApplicationUserRoute, getCurrentApplicationUser } from './controllers/applicationUserController';
import middlewares from './services/middlewares';
import { postApplicationUserLoginRoute, postApplicationUserVerifyToken } from './controllers/applicationUserAuthenticationController';

const router: Router = Router();

//  Users [PUBLIC]
router.put('/users', putUserRoute);
router.get('/users/me', [middlewares.isAuthenticated], getMe);
router.post('/users/activation', postUserActivation);

//  User Security [PUBLIC]
router.post('/login', postLoginRoute);
router.post('/refresh', postRefreshTokenRoute);

//  ApplicationUser [AUTH BY PRIVATE KEY]
router.put('/application-users', [middlewares.isAuthenticatedByPublicKey], putApplicationUserRoute);
router.get('/application-users/single/:userId', [middlewares.isAuthenticatedByPublicKey], getCurrentApplicationUser);
// publicRouter.post('/users/activation', );
router.post('/application-users/verify-token', [middlewares.isAuthenticatedByPrivateKey], postApplicationUserVerifyToken);

//  ApplicationUser Security [AUTH BY PUBLIC KEY]
router.post('/application-users/login', [middlewares.isAuthenticatedByPublicKey], postApplicationUserLoginRoute);
router.post('/application-users/refresh', [middlewares.isAuthenticatedByPublicKey], postRefreshTokenRoute);

//  Application [DASHBOARD]
router.put('/applications', [middlewares.isAuthenticated], putApplicationRoute);
router.delete('/applications/single/:applicationId', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], deleteApplicationRoute);
router.get('/applications/single/:applicationId', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationById);
router.get('/applications/single/:publicKey/key', [middlewares.isAuthenticated], getApplicationByPublicKey);
router.get('/application/:applicationId/owners', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationOwners);
router.post('/application/:applicationId/promote/:userId', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], postPromoteApplicationOwner);
router.post('/application/:applicationId/downgrade/:userId', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], postDowngradeApplicationOwner);
router.get('/applications/:applicationId/keys', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationKeys);
router.post('/applications/:applicationId/keys', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], postGenerateApplicationKey);
// publicRouter.get('/application/:applicationId/users', [middlewares.isAuthenticated, middlewares.applicationExists, middlewares.isApplicationOwner], getApplicationUsers);
// publicRouter.get('/applications/owned', [middlewares.isAuthenticated], getOwnedApplications);

//  Application [ADMIN]
// publicRouter.get('/applications', [middlewares.isAuthenticated, middlewares.isAdmin], getAllApplication);

export const useRouters = (app: Application): void => {
    app.use('/api', router);
};
