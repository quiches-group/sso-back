import { Request, Response } from 'express';
import { authenticate, authorizeUserApplication, revokeAuthorizeApplication } from '../services/authenticationService';

export const postLoginRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken, ...result } = await authenticate(req.body);

        if (result.redirectUrl) {
            const url = new URL(result.redirectUrl);
            res.cookie('SSO_Q_REFRESH_TOKEN', refreshToken, {
                httpOnly: true,
                domain: url.hostname,
                expires: new Date(Date.now() + 900000),
            });
        } else {
            res.cookie('SSO_Q_REFRESH_TOKEN', refreshToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 900000),
            });
        }
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
        await authorizeUserApplication(req.user, req.body, req.application);

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
