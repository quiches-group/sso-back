import Crypto from 'crypto';
import moment from 'moment';
import ApiError from '../errors/ApiError';
import UserRepository from '../repositories/UserRepository';
import { User } from '../models/User';
import { encryptPassword } from './authenticationService';
import { sendRegistrationMail } from './mailService';

export const createUser = async ({
    mail, password, firstname, lastname,
}: Record<string, string>): Promise<User> => {
    const userExists = await UserRepository.findOneBy({ mail });

    if (userExists != null) {
        throw new ApiError('USER_ALREADY_EXISTS');
    }

    const activationKey = Crypto.randomBytes(50).toString('hex');

    const encryptedPassword = await encryptPassword(password);

    const user = await UserRepository.saveData({
        mail, password: encryptedPassword, firstname, lastname, activationKey,
    });

    sendRegistrationMail(user);

    return user;
};

export const activeUser = async (body: Record<string, string>): Promise<void> => {
    if (!body.userId) {
        throw new ApiError('CANNOT_ACTIVE_USER');
    }

    const user = await UserRepository.findOneBy({ _id: body.userId });

    if (!user || user.isActive || user.activationKey !== body.activationKey) {
        throw new ApiError('CANNOT_ACTIVE_USER');
    }

    await UserRepository.updateOneBy({ _id: user._id }, {
        isActive: true,
        activationKey: null,
        registrationDate: moment().unix(),
    });
};
