import slugify from 'slugify';
import Crypto from 'crypto';
import ApplicationRepository from '../repositories/ApplicationRepository';
import { Application } from '../models/Application';
import ApiError from '../errors/ApiError';
import { User } from '../models/User';

export const createApplication = async (name: string): Promise<Application> => {
    const application = await ApplicationRepository.findOneBy({ name });

    if (application != null) {
        throw new ApiError('APPLICATION_ALREADY_EXISTS');
    }

    const slug = slugify(name).toLowerCase();
    return ApplicationRepository.saveData({ name, slug });
};

export const generateApplicationKeys = async (user: User, applicationId: string): Promise<void> => {
    const application = await ApplicationRepository.findOneById(applicationId);

    if (!application) {
        throw new ApiError('CANNOT_FIND_APPLICATION', 404);
    }

    if (!application.ownerRefs.includes(user._id)) {
        throw new ApiError('USER_NOT_OWNER', 401);
    }

    const keys = {
        publicKey: `pub_${Crypto.randomBytes(50).toString('hex')}`,
        privateKey: `priv_${Crypto.randomBytes(50).toString('hex')}`,
    };

    await ApplicationRepository.updateOneBy({ _id: application }, keys);
};

export const listOwnedApplicationsByUser = async (user: User): Promise<Application[]> =>
    ApplicationRepository.getApplicationsOwnedBy(user._id);

export const listUserApplications = async (user: User): Promise<Application[]> =>
    ApplicationRepository.getUserApplications(user);
