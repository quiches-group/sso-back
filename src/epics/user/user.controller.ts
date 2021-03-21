import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { UserIsAuthenticatedGuard } from '../../guards/user-is-authenticated.guard';
import { UserRegisterDto } from './dto/user-register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/me')
  @UseGuards(UserIsAuthenticatedGuard)
  // @ApiOperation({ summary: '' })
  @ApiSecurity('Bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  getCurrentUser(@Request() req: Request) {
    // @ts-ignore
    return req.user;
  }

  @Put('users')
  @HttpCode(201)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async registerUser(@Body() body: UserRegisterDto) {
    await this.userService.registerUser(body);
  }

  //  TODO: Implement activation endpoint
  // @Post('activation')
  // @ApiOkResponse()
  // @ApiBadRequestResponse()
  // async activeUser() {}

  @Post('login')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  async loginUser(@Body() params: LoginDto) {
    return await this.userService.loginUser(params);
  }

  // @ApiOkResponse()
  // @ApiUnauthorizedResponse()
  // @Post('refresh')
  // async refreshToken() {
  //   //  TODO: Implement Refresh token endpoint
  // }
}
