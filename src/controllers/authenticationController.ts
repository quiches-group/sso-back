import { Request, Response } from 'express';
import { authenticate } from '../services/authenticationService';

export const postLoginRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mail, password } = req.body;
        const result = await authenticate(mail, password);

        res.json({ data: result, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const postRefreshTokenRoute = async (req: Request, res: Response): Promise<void> => {};
