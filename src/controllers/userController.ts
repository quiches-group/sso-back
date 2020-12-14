import { Request, Response } from 'express';
import { createUser } from '../services/userService';

export const putUser = async (req: Request, res: Response): Promise<void> => {
    try {
        await createUser(req.body);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};
