import { Types } from 'mongoose';
import BaseRepository from './BaseRepository';
import { Application, ApplicationModel } from '../models/Application';
import UserRepository from './UserRepository';
import { User } from '../models/User';

class ApplicationRepository extends BaseRepository<Application> {
    constructor() {
        super(ApplicationModel);
    }

    getApplicationsOwnedBy = (userId: string): Promise<Application[]> =>
        super.findManyBy({ owners: userId })

    getUserApplications = async (user: Types.ObjectId | User): Promise<Application[]> => {
        if (user instanceof Types.ObjectId) {
            const userObject = await UserRepository.findOneById(String(user));

            if (!user) {
                throw new Error('Unable to find user');
            }

            return this.getUserApplications(userObject as User);
        }

        const { applications } = user as User;

        return this.findManyBy({ _id: { $in: applications } });
    }
}

export default new ApplicationRepository();
