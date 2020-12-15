import ApiError from '../errors/ApiError';
import UserRepository from '../repositories/UserRepository';
import { User } from '../models/User';
import { encryptPassword } from './authenticationService';

export const createUser = async ({
    mail, password, firstname, lastname,
}: Record<string, string>): Promise<User> => {
    const user = await UserRepository.findOneBy({ mail });

    if (user != null) {
        throw new ApiError('USER_ALREADY_EXISTS');
    }

    // const activationKey = Crypto.randomBytes(50).toString('hex');

    const encryptedPassword = await encryptPassword(password);

    return UserRepository.saveData({
        mail, password: encryptedPassword, firstname, lastname,
    });
};
