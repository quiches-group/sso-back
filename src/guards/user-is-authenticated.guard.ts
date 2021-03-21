import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import config from '../config';

@Injectable()
export class UserIsAuthenticatedGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers.authorization?.replace(/^Bearer\s/, '');

    if (!bearer) {
      throw new UnauthorizedException();
    }

    request.user = await this.verifyToken(bearer);

    return true;
  }

  verifyToken = async (bearerToken: string): Promise<User> =>
    new Promise((resolve) => {
      jwt.verify(bearerToken, config().jwt.secretKey, async (err, decoded) => {
        if (err || !decoded) {
          throw new UnauthorizedException();
        }

        const user = await this.userRepository.findOneById(decoded._id);

        if (!user) {
          throw new UnauthorizedException();
        }

        resolve(user);
      });
    });
}
