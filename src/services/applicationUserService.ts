import Crypto from 'crypto';
// import moment from 'moment';
import ApiError from '../errors/ApiError';
import ApplicationUserRepository from '../repositories/ApplicationUserRepository';
import { ApplicationUser } from '../models/ApplicationUser';
import { encryptPassword } from './authenticationService';
// import { sendRegistrationMail } from './mailService';
import { Application } from '../models/Application';

export const createApplicationUser = async ({
    mail, password, firstname, lastname,
}: Record<string, string>, application: Application): Promise<ApplicationUser> => {
    const userExists = await ApplicationUserRepository.findOneBy({ mail });

    if (userExists != null) {
        throw new ApiError('USER_ALREADY_EXISTS');
    }

    const activationKey = Crypto.randomBytes(50).toString('hex');

    const encryptedPassword = await encryptPassword(password);

    const user = await ApplicationUserRepository.saveData({
        mail, password: encryptedPassword, firstname, lastname, activationKey, applicationId: application._id,
    });

    // sendRegistrationMail(user);

    return user;
};

// export const activeUser = async (body: Record<string, string>): Promise<void> => {
//     if (!body.userId) {
//         throw new ApiError('CANNOT_ACTIVE_USER');
//     }
//
//     const user = await ApplicationUserRepository.findOneBy({ _id: body.userId });
//
//     if (!user || user.isActive || user.activationKey !== body.activationKey) {
//         throw new ApiError('CANNOT_ACTIVE_USER');
//     }
//
//     await ApplicationUserRepository.updateOneBy({ _id: user._id }, {
//         isActive: true,
//         activationKey: null,
//         registrationDate: moment().unix(),
//     });
// };
