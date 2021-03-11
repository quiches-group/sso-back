import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';
import { SECRET_KEY } from './authenticationService';
import ApplicationRepository from '../repositories/ApplicationRepository';

type Token = { _id: string }

const userIsAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send();
        return;
    }

    const bearer = authorization.replace(/^Bearer\s/, '');
    jwt.verify(bearer, SECRET_KEY!, async (err, decoded) => {
        if (err || !decoded) {
            res.status(401).json({ errors: { code: 'INVALID_TOKEN' }, data: {} });
            return;
        }

        const { _id } = decoded as Token;
        const user = await UserRepository.findOneById(_id);

        if (!user) {
            res.status(401).json({ errors: { code: 'INVALID_TOKEN' }, data: {} });
            return;
        }

        // @ts-ignore
        req.user = user;
        next();
    });
};

const userIsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // @ts-ignore
    const { user } = req;

    if (!user?.isAdmin) {
        res.status(401).json({ errors: { code: 'UNAUTHORIZED_ACTION' }, data: {} });
        return;
    }

    next();
};

const applicationExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const application = await ApplicationRepository.findOneById(req.params.applicationId);

    if (!application) {
        res.status(404).json({ errors: { code: 'CANNOT_FIND_APPLICATION' }, data: {} });
        return;
    }

    // @ts-ignore
    req.application = application;
    next();
};

const isAuthenticatedByPublicKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { publicKey } = req.query;

    if (!publicKey) {
        res.status(401).json({ errors: { code: 'UNAVAILABLE_PUBLIC_KEY' }, data: {} });
        return;
    }

    // @ts-ignore
    const application = await ApplicationRepository.findOneBy({ publicKey });

    if (!application) {
        res.status(401).json({ errors: { code: 'UNAVAILABLE_PUBLIC_KEY' }, data: {} });
        return;
    }

    // @ts-ignore
    req.application = application;
    next();
};

const isAuthenticatedByPrivateKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { privateKey } = req.query;

    if (!privateKey) {
        res.status(401).json({ errors: { code: 'UNAVAILABLE_PRIVATE_KEY' }, data: {} });
        return;
    }

    // @ts-ignore
    const application = await ApplicationRepository.findOneBy({ privateKey });

    if (!application) {
        res.status(401).json({ errors: { code: 'UNAVAILABLE_PRIVATE_KEY' }, data: {} });
        return;
    }

    // @ts-ignore
    req.application = application;
    next();
};

const isApplicationOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // @ts-ignore
    const { application } = req;

    // @ts-ignore
    if (!application!.ownerRefs.includes(req.user._id)) {
        res.status(401).json({ errors: { code: 'USER_NOT_OWNER' }, data: {} });
        return;
    }

    next();
};

const userInParamsIsCurrentUser = (req: Request, res: Response, next: NextFunction): void => {
    const { userId } = req.params;
    // @ts-ignore
    const { user } = req;

    if (String(userId) !== String(user._id)) {
        res.status(401).json({ errors: { code: 'UNAUTHORIZED_ACTION' }, data: {} });
        return;
    }

    next();
};

export default {
    isAuthenticated: userIsAuthenticated,
    isAdmin: userIsAdmin,
    userInParamsIsCurrentUser,
    isApplicationOwner,
    applicationExists,
    isAuthenticatedByPublicKey,
    isAuthenticatedByPrivateKey,
};
