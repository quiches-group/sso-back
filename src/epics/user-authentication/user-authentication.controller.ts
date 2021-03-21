import { Body, Controller, Post } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { LoginDto } from './dto/login.dto';
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

  @Post('login')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  async loginUser(@Body() params: LoginDto) {
    return await this.userAuthenticationService.loginUser(params);
  }

  // @ApiOkResponse()
  // @ApiUnauthorizedResponse()
  // @Post('refresh')
  // async refreshToken() {
  //   //  TODO: Implement Refresh token endpoint
  // }
}
