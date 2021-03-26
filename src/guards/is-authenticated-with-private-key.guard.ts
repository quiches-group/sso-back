import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationRepository } from '../repositories/application.repository';

@Injectable()
export class IsAuthenticatedWithPrivateKeyGuard implements CanActivate {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const privateKey = request.query?.privateKey;

    if (!privateKey) {
      throw new UnauthorizedException({ message: 'MISSING_PRIVATE_KEY' });
    }

    const application = await this.applicationRepository.findOneBy({
      privateKey,
    });

    if (!application) {
      throw new UnauthorizedException();
    }

    request.application = application;

    return true;
  }
}
