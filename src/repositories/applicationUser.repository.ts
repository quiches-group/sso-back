import { Injectable } from '@nestjs/common';
import {
  ApplicationUser,
  ApplicationUserDocument,
} from '../models/applicationUser.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import BaseRepository from './base.repository';

@Injectable()
export class ApplicationUserRepository extends BaseRepository<ApplicationUserDocument> {
  constructor(
    @InjectModel(ApplicationUser.name)
    private model: Model<ApplicationUserDocument>,
  ) {
    super(model);
  }
}
