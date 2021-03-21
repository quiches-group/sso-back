import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplicationUserRegisterDto } from './dto/application-user-register.dto';
import { ApplicationUserRepository } from '../../repositories/applicationUser.repository';
import { AuthenticationService } from '../../services/authentication.service';
import { Application } from '../../models/application.model';
import { TokenDto } from './dto/token.dto';
import { ApplicationUser } from '../../models/applicationUser.model';

@Injectable()
export class ApplicationUserService {
  constructor(
    private readonly applicationUserRepository: ApplicationUserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  registerApplicationUser = async (
    params: ApplicationUserRegisterDto,
    application: Application,
  ): Promise<void> => {
    const existingUser = await this.applicationUserRepository.findOneBy({
      mail: params.mail,
    });

    if (existingUser !== null) {
      throw new BadRequestException();
    }

    const activationKey = this.authenticationService.createActivationKey();

    const password = await this.authenticationService.encryptPassword(
      params.password,
    );

    const applicationUser = await this.applicationUserRepository.insert({
      ...params,
      password,
      activationKey,
      applicationId: application._id,
    });

    // TODO: Send Registration Mail
    // sendRegistrationMail(user);
  };

  verifyToken = ({ token }: TokenDto): Promise<ApplicationUser> =>
    this.authenticationService.verifyApplicationUserToken(token);
}
