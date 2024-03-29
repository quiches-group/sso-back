import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { UserRegisterDto } from './dto/user-register.dto';
import {
  AuthenticationService,
  TokenPair,
} from '../../services/authentication.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from '../application-user/dto/token.dto';
import { User } from '../../models/user.model';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  registerUser = async (params: UserRegisterDto): Promise<void> => {
    const existingUser = await this.userRepository.findOneBy({
      mail: params.mail,
    });

    if (existingUser !== null) {
      throw new BadRequestException();
    }

    const activationKey = this.authenticationService.createActivationKey();

    const password = await this.authenticationService.encryptPassword(
      params.password,
    );

    const user = await this.userRepository.insert({
      ...params,
      password,
      activationKey,
    });

    // TODO: Send Registration Mail
    // sendRegistrationMail(user);
  };

  loginUser = async (params: LoginDto) => {
    const user = await this.userRepository.findOneBy({ mail: params.mail }, [
      'password',
    ]);
    if (
      !user ||
      !(await this.authenticationService.comparePassword({
        password: params.password,
        storedPassword: user.password,
      }))
    ) {
      throw new UnauthorizedException();
    }

    return this.authenticationService.generateTokenPair(user);
  };

  verifyToken = (params: TokenDto): Promise<User> =>
    this.authenticationService.verifyUserToken(params.token);

  refreshToken = async (params: RefreshTokenDto): Promise<TokenPair> => {
    const token = await this.refreshTokenRepository.findOneBy({
      token: params.refreshToken,
    });

    if (!token || !token.active || token.expirationDate < moment().unix()) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneById(token.userId);
    this.refreshTokenRepository.updateOneBy(
      { _id: token._id },
      { active: false },
    );

    return this.authenticationService.generateTokenPair(user);
  };
}
