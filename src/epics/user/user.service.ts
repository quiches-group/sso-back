import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { RegisterDto } from './dto/register.dto';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationServices: AuthenticationService,
  ) {}

  registerUser = async (params: RegisterDto): Promise<void> => {
    const existingUser = await this.userRepository.findOneBy({
      mail: params.mail,
    });

    if (existingUser !== null && existingUser) {
      throw new BadRequestException();
    }

    const activationKey = this.authenticationServices.createActivationKey();

    const password = await this.authenticationServices.encryptPassword(
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
}
