import BaseRepository from './BaseRepository';
import { ApplicationUser, ApplicationUserModel } from '../models/ApplicationUser';

class ApplicationUserRepository extends BaseRepository<ApplicationUser> {
    constructor() {
        super(ApplicationUserModel);
    }
}

export default new ApplicationUserRepository();
