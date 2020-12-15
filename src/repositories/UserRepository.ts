import BaseRepository from './BaseRepository';
import { User, UserModel } from '../models/User';

class UserRepository extends BaseRepository<User> {
    constructor() {
        super(UserModel);
    }
}

export default new UserRepository();
