import { Request, Response } from 'express';
import {
    createApplication,
    generateApplicationKeys, listAllApplications, listApplicationKeys, listApplicationOwners, listApplicationUsers,
    listOwnedApplicationsByUser,
    listAuthorizedApplications, promoteApplicationOwner, downgradeApplicationOwner,
} from '../services/applicationService';

export const putApplicationRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        // @ts-ignore
        await createApplication(name, req.user);

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
        await generateApplicationKeys(req.params.applicationId);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getAllApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const applications = await listAllApplications();

        res.status(200).json({ data: applications, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getApplicationKeys = async (req: Request, res: Response): Promise<void> => {
    try {
        const keys = await listApplicationKeys(req.params.applicationId);

        res.status(200).json({ data: keys, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getAuthorizedApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const applications = await listAuthorizedApplications(req.user);

        res.status(200).json({ data: applications, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getApplicationOwners = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const users = await listApplicationOwners(req.application);

        res.status(200).json({ data: users, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const getApplicationUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const users = await listApplicationUsers(req.application);

        res.status(200).json({ data: users, error: {} });
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const postPromoteApplicationOwner = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        await promoteApplicationOwner(req.application, req.params.userId);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};

export const postDowngradeApplicationOwner = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        await downgradeApplicationOwner(req.application, req.params.userId);

        res.status(201).send();
    } catch (e) {
        res.status(e.statusCode).json({ data: {}, error: { code: e.code } });
    }
};
