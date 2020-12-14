import { FilterQuery } from 'mongoose';
import BaseRepository from './BaseRepository';
import { User, UserModel } from '../models/User';
import ApiError from '../errors/ApiError';

class UserRepository extends BaseRepository<User> {
    constructor() {
        super(UserModel);
    }

    async saveData(data: FilterQuery<User>): Promise<User> {
        const user = await super.findOneBy({ mail: data.mail });

        if (user != null) {
            throw new ApiError('USER_ALREADY_EXISTS');
        }

        return super.saveData(data);
    }
}

export default new UserRepository();
