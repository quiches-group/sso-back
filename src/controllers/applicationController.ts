import { Request, Response } from 'express';
import { createApplication } from '../services/applicationService';

export const putApplicationRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        await createApplication(name);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getOwnedApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const applications = await listOwnedApplicationsByUser(req.user);

        res.status(200).json({ data: applications, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};
