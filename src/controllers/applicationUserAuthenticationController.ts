import { Request, Response } from 'express';
import {
    applicationUserAuthenticate,
    verifyApplicationUserToken,
} from '../services/authenticationService';
import { Application } from '../models/Application';

export const postApplicationUserLoginRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const application = req.application as Application;
        const result = await applicationUserAuthenticate(req.body, application);

        res.json({ data: result, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const postRefreshTokenRoute = async (req: Request, res: Response): Promise<void> => {

};

export const postApplicationUserVerifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        await verifyApplicationUserToken(req.body);

        res.status(203).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};
