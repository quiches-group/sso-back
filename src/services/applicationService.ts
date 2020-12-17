import slugify from 'slugify';
import Crypto from 'crypto';
import ApplicationRepository from '../repositories/ApplicationRepository';
import { Application, PublicApplication } from '../models/Application';
import ApiError from '../errors/ApiError';
import { User } from '../models/User';
import UserRepository from '../repositories/UserRepository';

export const generateApplicationKeys = async (applicationId: string): Promise<void> => {
    const keys = {
        publicKey: `pub_${Crypto.randomBytes(50).toString('hex')}`,
        privateKey: `priv_${Crypto.randomBytes(50).toString('hex')}`,
    };

    await ApplicationRepository.updateOneBy({ _id: applicationId }, keys);
};

export const selectApplicationByPublicKey = async (publicKey: string): Promise<PublicApplication> => {
    const application = await ApplicationRepository.findApplicationByPublicKey(publicKey);

    if (!application) {
        throw new ApiError('CANNOT_FIND_APPLICATION', 404);
    }

    return application;
};

export const listAllApplications = (): Promise<Application[]> =>
    ApplicationRepository.findManyBy({});

export const listOwnedApplicationsByUser = (user: User): Promise<Application[]> =>
    ApplicationRepository.getApplicationsOwnedBy(user._id);

export const listAuthorizedApplications = (user: User): Promise<Application[]> =>
    ApplicationRepository.getUserApplications(user);

export const listApplicationKeys = (applicationId: string): Promise<{ privateKey?: string, publicKey?: string }> =>
    ApplicationRepository.findOneById(applicationId, ['privateKey', 'publicKey'])
        .then((application: Application | null) => application!)
        .then(({ privateKey, publicKey }: Application) => ({ privateKey, publicKey }));

export const listApplicationOwners = (application: Application): Promise<User[]> =>
    UserRepository.findManyBy({ _id: { $in: application.ownerRefs } });

export const listApplicationUsers = (application: Application): Promise<User[]> =>
    UserRepository.findManyBy({ applicationsRefs: application._id });

export const promoteApplicationOwner = async (application: Application, userId: string): Promise<void> => {
    const user = await UserRepository.findOneById(userId);

    if (!user) {
        throw new ApiError('CANNOT_FIND_USER', 404);
    }

    await ApplicationRepository.pushArray({ _id: application._id }, { ownerRefs: userId });
};

export const downgradeApplicationOwner = async (application: Application, userId: string): Promise<void> => {
    const user = await UserRepository.findOneById(userId);

    if (!user) {
        throw new ApiError('CANNOT_FIND_USER', 404);
    }

    await ApplicationRepository.pullArray({ _id: application._id }, { ownerRefs: userId });
};

export const createApplication = async (name: string, user: User): Promise<Application> => {
    const createdApplication = await ApplicationRepository.findOneBy({ name });

    if (createdApplication !== null) {
        throw new ApiError('APPLICATION_ALREADY_EXISTS');
    }

    const slug = slugify(name).toLowerCase();
    const application = await ApplicationRepository.saveData({ name, slug });
    await promoteApplicationOwner(application, String(user._id));

    return application;
};

export const addCallbackUrl = async (application: Application, url: string): Promise<void> => {
    await ApplicationRepository.pushArray({ _id: application._id }, { callbackUrls: url });
};
