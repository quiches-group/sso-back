import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class UserIsAuthenticatedGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers?.authorization?.replace(/^Bearer\s/, '');

    if (!bearer) {
      throw new UnauthorizedException();
    }

    request.user = await this.authenticationService.verifyUserToken(bearer);

    return true;
  }
}
