import { Request, Response } from 'express';
import { createApplicationUser } from '../services/applicationUserService';
import { Application } from '../models/Application';

export const putApplicationUserRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const application = req.application as Application;

        await createApplicationUser(req.body, application);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getCurrentApplicationUser = async (req: Request, res: Response): Promise<void> => {
    //  TODO: Get User By userId in params
    // @ts-ignore
    res.status(200).json({ data: req.applicationUse, error: {} });
};

// export const postUserActivation = async (req: Request, res: Response): Promise<void> => {
//     try {
//         await activeUser(req.body);
//
//         res.status(201).send();
//     } catch (e) {
//         res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
//     }
// };
