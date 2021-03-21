import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../../repositories/user.repository';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable()
export class UserAuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

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
      throw new HttpException(
        { statusCode: HttpStatus.UNAUTHORIZED, message: 'UNAUTHORIZED' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authenticationService.generateTokenPair(user);
  };
}
