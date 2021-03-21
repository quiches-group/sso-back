import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/loginDTO';
import { UserRepository } from '../../repositories/user.repository';
import * as bCrypt from 'bcrypt';
import { User } from '../../models/user.model';
import { ApplicationUser } from '../../models/applicationUser.model';
import { Application } from '../../models/application.model';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import config from '../../config';
import * as cryptoJs from 'crypto-js';
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository';

type TokenPair = { token: string; refreshToken: string };

@Injectable()
export class UserAuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  loginUser = async (params: LoginDTO) => {
    const user = await this.userRepository.findOneBy({ mail: params.mail }, [
      'password',
    ]);
    if (
      !user ||
      !(await this.comparePassword({
        password: params.password,
        storedPassword: user.password,
      }))
    ) {
      throw new HttpException(
        { statusCode: HttpStatus.UNAUTHORIZED, message: 'UNAUTHORIZED' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.generateTokenPair(user);
  };

  private encryptPassword = async (password: string): Promise<string> =>
    bCrypt.hash(password, 15);

  private comparePassword = async ({
    password,
    storedPassword,
  }: {
    password: string;
    storedPassword: string;
  }): Promise<boolean> => bCrypt.compare(password, storedPassword);

  private generateTokenPair = async (
    user: User | ApplicationUser,
    application?: Application,
  ): Promise<TokenPair> => ({
    token: await this.createToken(user, application),
    refreshToken: await this.createRefreshToken(user),
  });

  private createToken = (
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

  private createRefreshToken = async (
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
