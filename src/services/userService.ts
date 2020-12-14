import { DataType } from '../repositories/BaseRepository';
import UserRepository from '../repositories/UserRepository';
import { User } from '../models/User';

export const createUser = (properties: DataType): Promise<User> =>
    UserRepository.saveData(properties);
