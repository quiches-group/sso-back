import { Injectable } from '@nestjs/common';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../models/refreshToken.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import BaseRepository from './base.repository';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokenDocument> {
  constructor(
    @InjectModel(RefreshToken.name) private model: Model<RefreshTokenDocument>,
  ) {
    super(model);
  }
}
