import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
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
}
