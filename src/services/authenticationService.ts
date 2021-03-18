import bCrypt from 'bcrypt';
import moment from 'moment';
import cryptoJs from 'crypto-js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import UserRepository from '../repositories/UserRepository';
import ApiError from '../errors/ApiError';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { ApplicationUser } from '../models/ApplicationUser';
import ApplicationUserRepository from '../repositories/ApplicationUserRepository';

const { JWT_TOKEN_EXPIRATION_TIME, JWT_REFRESH_TOKEN_EXPIRATION_TIME } = process.env;
export const SECRET_KEY = fs.readFileSync(`${__dirname}/../../key.JWT`, { encoding: 'utf-8' });

export const encryptPassword = (password: string): Promise<string> =>
    bCrypt.hash(password, 15);

export const comparePassword = async ({ password, storedPassword }: { password: string; storedPassword: string }): Promise<boolean> =>
    bCrypt.compare(password, storedPassword);

export const createToken = (user: User | ApplicationUser, application?: Application): string => ((!application)
    ? jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: Number(JWT_TOKEN_EXPIRATION_TIME) })
    : jwt.sign({ _id: user._id, appid: application._id }, SECRET_KEY, { expiresIn: Number(JWT_TOKEN_EXPIRATION_TIME) }));

export const createRefreshToken = async (user: User | ApplicationUser, application?: Application): Promise<string> => {
    const expirationDate = moment().add(JWT_REFRESH_TOKEN_EXPIRATION_TIME, 'seconds').unix();
    const token = cryptoJs.SHA256(`${user._id}.${user.mail}.${moment().unix()}.${expirationDate}`).toString();

    const data = (!application)
        ? { token, expirationDate, userId: user._id }
        : { token, expirationDate, applicationUserId: user._id };

    const result = await RefreshTokenRepository.saveData(data);

    return result.token;
};

type TokenPair = { token: string, refreshToken: string };
const generateTokenPair = async (user: User | ApplicationUser, application?: Application): Promise<TokenPair> => ({
    token: await createToken(user, application),
    refreshToken: await createRefreshToken(user),
});

export const authenticate = async (body: Record<string, string>): Promise<Record<string, string>> => {
    const { mail, password } = body;

    const user = await UserRepository.findOneBy({ mail }, ['password']);

    if (!user || !(await comparePassword({ password, storedPassword: user.password }))) {
        throw new ApiError('BAD_CREDENTIALS', 401);
    }

    return generateTokenPair(user!);
};

export const applicationUserAuthenticate = async (body: Record<string, string>, application: Application): Promise<Record<string, string>> => {
    const { mail, password } = body;

    const user = await ApplicationUserRepository.findOneBy({ mail }, ['password']);

    if (!user || !(await comparePassword({ password, storedPassword: user.password }))) {
        throw new ApiError('BAD_CREDENTIALS', 401);
    }

    return generateTokenPair(user!, application);
};

export const verifyApplicationUserToken = (body: Record<string, string>, application: Application): Promise<void> => new Promise((resolve, reject) => {
    const { token } = body;

    jwt.verify(token, SECRET_KEY!, async (err, decoded) => {
        if (err || !decoded) {
            reject(new ApiError('BAD_CREDENTIALS', 401));
            return;
        }

        // @ts-ignore
        const { _id } = decoded;
        const user = await ApplicationUserRepository.findOneBy({ _id, applicationId: application._id });

        if (!user) {
            reject(new ApiError('BAD_CREDENTIALS', 401));
            return;
        }

        resolve();
    });
});

export const verifyUserToken = (body: Record<string, string>): Promise<void> => new Promise((resolve, reject) => {
    const { token } = body;

    jwt.verify(token, SECRET_KEY!, async (err, decoded) => {
        if (err || !decoded) {
            reject(new ApiError('BAD_CREDENTIALS', 401));
            return;
        }

        // @ts-ignore
        const { _id } = decoded;
        const user = await UserRepository.findOneBy({ _id });

        if (!user) {
            reject(new ApiError('BAD_CREDENTIALS', 401));
            return;
        }

        resolve();
    });
});

export const requestNewToken = async (refreshToken: string, application?: Application): Promise<TokenPair> => {
    const storedToken = await RefreshTokenRepository.findOneBy({ token: refreshToken });

    if (!storedToken || !storedToken.active || storedToken.expirationDate < moment().unix()) {
        throw new ApiError('CANT_REFRESH_TOKEN', 401);
    }

    RefreshTokenRepository.updateOneBy({ _id: storedToken._id }, { active: false });

    const user = (!storedToken.applicationUserId)
        ? await UserRepository.findOneBy({ _id: storedToken.userId })
        : await ApplicationUserRepository.findOneBy({ _id: storedToken.applicationUserId });

    if (!user) {
        throw new ApiError('CANT_REFRESH_TOKEN', 401);
    }

    return generateTokenPair(user, application);
};
