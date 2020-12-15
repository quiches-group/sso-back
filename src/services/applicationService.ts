import slugify from 'slugify';
import ApplicationRepository from '../repositories/ApplicationRepository';
import { Application } from '../models/Application';
import ApiError from '../errors/ApiError';

export const createApplication = async (name: string): Promise<Application> => {
    const application = await ApplicationRepository.findOneBy({ name });

    if (application != null) {
        throw new ApiError('APPLICATION_ALREADY_EXISTS');
    }

    const slug = slugify(name).toLowerCase();
    return ApplicationRepository.saveData({ name, slug });
};
