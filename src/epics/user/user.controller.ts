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
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { UserIsAuthenticatedGuard } from '../../guards/user-is-authenticated.guard';
import { UserRegisterDto } from './dto/user-register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from '../application-user/dto/token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(UserIsAuthenticatedGuard)
  // @ApiOperation({ summary: '' })
  @ApiSecurity('Bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  getCurrentUser(@Request() req: Request) {
    // @ts-ignore
    return req.user;
  }

  @Post('verify-token')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  async verifyUserToken(@Body() body: TokenDto) {
    await this.userService.verifyToken(body);
  }

  @Put()
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

  @Post('refresh-token')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.userService.refreshToken(body);
  }
}
