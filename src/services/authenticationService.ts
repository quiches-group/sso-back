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
import ApplicationRepository from '../repositories/ApplicationRepository';

const { JWT_TOKEN_EXPIRATION_TIME, JWT_REFRESH_TOKEN_EXPIRATION_TIME } = process.env;
export const SECRET_KEY = fs.readFileSync(`${__dirname}/../../key.JWT`, { encoding: 'utf-8' });

export const encryptPassword = (password: string): Promise<string> =>
    bCrypt.hash(password, 15);

export const comparePassword = async ({ password, storedPassword }: { password: string; storedPassword: string }): Promise<boolean> =>
    bCrypt.compare(password, storedPassword);

export const createToken = (_id: string): string =>
    jwt.sign({ _id }, SECRET_KEY, { expiresIn: Number(JWT_TOKEN_EXPIRATION_TIME) });

export const createRefreshToken = async (_id: string): Promise<string> => {
    const expirationDate = moment().add(JWT_REFRESH_TOKEN_EXPIRATION_TIME, 'seconds').unix();
    const token = cryptoJs.SHA256(`${_id}.${moment().unix()}.${expirationDate}`).toString();

    const result = await RefreshTokenRepository.saveData({
        token,
        expirationDate,
    });

    return result.token;
};

type TokenPair = { token: string, refreshToken: string };
const generateTokenPair = async (_id: string): Promise<TokenPair> => ({
    token: await createToken(_id),
    refreshToken: await createRefreshToken(_id),
});

export const authenticate = async (body: Record<string, string>): Promise<Record<string, string>> => {
    const {
        mail, password, redirectUrl, publicKey,
    } = body;

    const isThirdPartyApplication = (redirectUrl || publicKey) ?? false;
    const application = await ApplicationRepository.findOneBy({ publicKey });

    const redirectUrlIsApplicationCallBack = application?.callbackUrls.includes(redirectUrl);
    if (isThirdPartyApplication && (!application || !redirectUrlIsApplicationCallBack)) {
        throw new ApiError('APPLICATION_ERROR');
    }

    const user = await UserRepository.findOneBy({ mail }, ['password']);

    if (!user || !(await comparePassword({ password, storedPassword: user.password }))) {
        throw new ApiError('BAD_CREDENTIALS', 401);
    }

    const keys = await generateTokenPair(String(user._id));

    if (isThirdPartyApplication && !user.applicationsRefs.includes(application!._id)) {
        return { ...keys, action: 'AUTHORIZE_APPLICATION' };
    } if (isThirdPartyApplication) {
        return {
            ...keys,
            redirectUrl: `${redirectUrl}?token=${keys.token}&refresh_token=${keys.refreshToken}`,
            action: 'REDIRECT',
        };
    }

    return keys;
};

export const authorizeUserApplication = async (user: User, application: Application): Promise<void> => {
    if (user.applicationsRefs.includes(application._id)) {
        throw new ApiError('APPLICATION_ALREADY_AUTHORIZE', 400);
    }

    await UserRepository.pushArray({ _id: user._id }, { applicationsRefs: application._id });
};

export const revokeAuthorizeApplication = async (user: User, application: Application): Promise<void> => {
    if (!user.applicationsRefs.includes(application._id)) {
        throw new ApiError('APPLICATION_NOT_AUTHORIZE', 400);
    }

    await UserRepository.pullArray({ _id: user._id }, { applicationsRefs: application._id });
};
