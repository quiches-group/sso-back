import { Types } from 'mongoose';
import BaseRepository from './BaseRepository';
import { Application, ApplicationModel, PublicApplication } from '../models/Application';
import UserRepository from './UserRepository';
import { User } from '../models/User';

class ApplicationRepository extends BaseRepository<Application> {
    constructor() {
        super(ApplicationModel);
    }

    findApplicationByPublicKey = async (publicKey: string): Promise<PublicApplication | null> => {
        const application = await super.findOneBy({ publicKey });

        if (!application) {
            return null;
        }

        return { name: application.name };
    }
}

export default new ApplicationRepository();
