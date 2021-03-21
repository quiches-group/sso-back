import { Injectable } from '@nestjs/common';
import config from '../config';
import * as moment from 'moment';
import * as bCrypt from 'bcrypt';
import * as cryptoJs from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { User } from '../models/user.model';
import { ApplicationUser } from '../models/applicationUser.model';
import { Application } from '../models/application.model';

type TokenPair = { token: string; refreshToken: string };

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  encryptPassword = async (password: string): Promise<string> =>
    bCrypt.hash(password, 15);

  comparePassword = async ({
    password,
    storedPassword,
  }: {
    password: string;
    storedPassword: string;
  }): Promise<boolean> => bCrypt.compare(password, storedPassword);

  generateTokenPair = async (
    user: User | ApplicationUser,
    application?: Application,
  ): Promise<TokenPair> => ({
    token: await this.createToken(user, application),
    refreshToken: await this.createRefreshToken(user),
  });

  createToken = (
    user: User | ApplicationUser,
    application?: Application,
  ): string =>
    !application
      ? jwt.sign({ _id: user._id }, config().jwt.secretKey, {
          expiresIn: Number(config().jwt.tokenExpirationTime),
        })
      : jwt.sign(
          { _id: user._id, appid: application._id },
          config().jwt.secretKey,
          {
            expiresIn: Number(config().jwt.tokenExpirationTime),
          },
        );

  createRefreshToken = async (
    user: User | ApplicationUser,
    application?: Application,
  ): Promise<string> => {
    const expirationDate = moment()
      .add(config().jwt.refreshTokenExpirationTime, 'seconds')
      .unix();
    const token = cryptoJs
      .SHA256(`${user._id}.${user.mail}.${moment().unix()}.${expirationDate}`)
      .toString();

    const data = !application
      ? { token, expirationDate, userId: user._id }
      : { token, expirationDate, applicationUserId: user._id };

    const result = await this.refreshTokenRepository.insert(data);

    return result.token;
  };
}
