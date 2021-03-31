import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from '../../models/application.model';
import { ApplicationRepository } from '../../repositories/application.repository';
import slugify from 'slugify';
import { UserRepository } from '../../repositories/user.repository';
import * as Crypto from 'crypto';
import { User } from '../../models/user.model';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  createApplication = async (
    { name }: CreateApplicationDto,
    user: User,
  ): Promise<Application> => {
    const existingApplication = await this.applicationRepository.findOneBy({
      name,
    });

    if (existingApplication !== null) {
      throw new BadRequestException();
    }

    const slug = slugify(name).toLowerCase();
    const application = await this.applicationRepository.insert({ name, slug });
    await this.promoteApplicationOwner(application, String(user._id));
    await this.generateApplicationKeys(String(application._id));

    return application;
  };

  private promoteApplicationOwner = async (
    application: Application,
    userId: string,
  ): Promise<void> => {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.applicationRepository.pushArray(
      { _id: application._id },
      { ownerRefs: userId },
    );
  };

  private generateApplicationKeys = async (
    applicationId: string,
  ): Promise<void> => {
    const keys = {
      publicKey: `pub_${Crypto.randomBytes(50).toString('hex')}`,
      privateKey: `priv_${Crypto.randomBytes(50).toString('hex')}`,
    };

    await this.applicationRepository.updateOneBy({ _id: applicationId }, keys);
  };

  getApplicationByPrivateKey = async (
    privateKey: string,
  ): Promise<Application> => {
    const application = await this.applicationRepository.findOneBy({
      privateKey,
    });

    if (!application) {
      throw new NotFoundException();
    }

    return application;
  };

  getApplicationsOwnedByUser = (user: User): Promise<Application[]> =>
    this.applicationRepository.findManyBy({ ownerRefs: String(user._id) }, [
      'privateKey',
      'publicKey',
    ]);

  removeApplicationById = (applicationId: string): Promise<boolean> =>
    this.applicationRepository.deleteOnyBy({ _id: applicationId });
}
