import * as moment from 'moment';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { RefreshToken } from '../models/refreshToken.model';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RefreshTokenDeletionCron {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleCron() {
    this.deleteAllExpiredOrUsedRefreshTokens();
  }

  deleteAllExpiredOrUsedRefreshTokens = async () => {
    const refreshTokens = await this.refreshTokenRepository.findManyBy({});

    refreshTokens.forEach((token: RefreshToken) => {
      if (!token.active || token.expirationDate < moment().unix()) {
        this.refreshTokenRepository.deleteOnyBy({ _id: token._id });
      }
    });
  };
}
