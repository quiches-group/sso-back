import { Injectable } from '@nestjs/common';
import { Application, ApplicationDocument } from '../models/application.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import BaseRepository from './base.repository';

@Injectable()
export class ApplicationRepository extends BaseRepository<ApplicationDocument> {
  constructor(
    @InjectModel(Application.name) private model: Model<ApplicationDocument>,
  ) {
    super(model);
  }
}
