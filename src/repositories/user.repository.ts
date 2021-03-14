import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../models/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import BaseRepository from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {
    super(model);
  }
}
