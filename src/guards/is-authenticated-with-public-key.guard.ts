import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationRepository } from '../repositories/application.repository';

@Injectable()
export class IsAuthenticatedWithPublicKeyGuard implements CanActivate {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const publicKey = request.query?.publicKey;

    if (!publicKey) {
      throw new UnauthorizedException({ message: 'MISSING_PUBLIC_KEY' });
    }

    const application = await this.applicationRepository.findOneBy({
      publicKey,
    });

    if (!application) {
      throw new UnauthorizedException();
    }

    request.application = application;

    return true;
  }
}
