import { Body, Controller, Post } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { LoginDTO } from './dto/loginDTO';

@Controller('/api')
export class UserAuthenticationController {
  constructor(
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {}

  @Post('/login')
  async loginUser(@Body() params: LoginDTO) {
    return await this.userAuthenticationService.loginUser(params);
  }
}
