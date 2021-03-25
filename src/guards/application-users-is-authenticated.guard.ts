import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { ApplicationUserRepository } from '../repositories/applicationUser.repository';

@Injectable()
export class ApplicationUsersIsAuthenticatedGuard implements CanActivate {
  constructor(
    private readonly applicationUserRepository: ApplicationUserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers?.authorization?.replace(/^Bearer\s/, '');

    if (!bearer) {
      throw new UnauthorizedException();
    }

    request.user = await this.authenticationService.verifyApplicationUserToken(
      bearer,
    );

    return true;
  }
}
