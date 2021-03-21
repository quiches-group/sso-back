import { Body, Controller, Post } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { LoginDTO } from './dto/loginDTO';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User Authentication')
@Controller()
export class UserAuthenticationController {
  constructor(
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {}

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Post('login')
  async loginUser(@Body() params: LoginDTO) {
    return await this.userAuthenticationService.loginUser(params);
  }
}
