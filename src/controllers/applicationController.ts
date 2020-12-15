import { Request, Response } from 'express';
import {
    createApplication,
    generateApplicationKeys,
    listOwnedApplicationsByUser,
    listUserApplications,
} from '../services/applicationService';
import { User } from '../models/User';

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

export const postGenerateApplicationKey = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        await generateApplicationKeys(req.user as User, req.params.applicationId);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getUserApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const applications = await listUserApplications(req.user);

        res.status(200).json({ data: applications, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};
