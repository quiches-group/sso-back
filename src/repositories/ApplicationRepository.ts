import { Types } from 'mongoose';
import BaseRepository from './BaseRepository';
import { Application, ApplicationModel } from '../models/Application';
import UserRepository from './UserRepository';
import { User } from '../models/User';

class ApplicationRepository extends BaseRepository<Application> {
    constructor() {
        super(ApplicationModel);
    }

    getApplicationsOwnedBy = (userId: Types.ObjectId): Promise<Application[]> =>
        super.findManyBy({ ownerRefs: userId })

    getUserApplications = async (user: Types.ObjectId | User): Promise<Application[]> => {
        if (user instanceof Types.ObjectId) {
            const userObject = await UserRepository.findOneById(String(user));

            if (!user) {
                throw new Error('Unable to find user');
            }

            return this.getUserApplications(userObject as User);
        }

        const { applicationsRefs } = user as User;

        return this.findManyBy({ _id: { $in: applicationsRefs } });
    }
}

export default new ApplicationRepository();
