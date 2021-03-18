import { Request, Response } from 'express';
import {
    authenticate, verifyApplicationUserToken, verifyUserToken,
} from '../services/authenticationService';
import { Application } from '../models/Application';

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

export const postUserVerifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        await verifyUserToken(req.body);

        res.status(203).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};
