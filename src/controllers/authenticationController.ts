import { Request, Response } from 'express';
import { authenticate, authorizeUserApplication, revokeAuthorizeApplication } from '../services/authenticationService';

export const postLoginRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authenticate(req.body);

        res.json({ data: result, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const postRefreshTokenRoute = async (req: Request, res: Response): Promise<void> => {

};

export const postAuthorizeUserApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        await authorizeUserApplication(req.user, req.application);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const postRevokeAuthorizedApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        await revokeAuthorizeApplication(req.user, req.application);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};
