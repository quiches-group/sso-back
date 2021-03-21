import {
  Body,
  Controller,
  HttpCode,
  Put,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApplicationUserService } from './application-user.service';
import { IsAuthenticatedWithPublicKeyGuard } from '../../guards/is-authenticated-with-public-key.guard';
import { ApplicationUserRegisterDto } from './dto/application-user-register.dto';
import { TokenDto } from './dto/token.dto';
import { LoginDto } from '../user/dto/login.dto';

@Controller('application-users')
@ApiTags('Application Users')
export class ApplicationUserController {
  constructor(
    protected readonly applicationUserService: ApplicationUserService,
  ) {}

  @Put()
  @HttpCode(201)
  @UseGuards(IsAuthenticatedWithPublicKeyGuard)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('Public Key')
  async registerApplicationUser(
    @Body() body: ApplicationUserRegisterDto,
    @Request() request: Request,
  ) {
    // @ts-ignore
    const application = request.application;
    await this.applicationUserService.registerApplicationUser(
      body,
      application,
    );
  }

  //  TODO: Implement activation endpoint
  // @Post('activation')
  // @ApiOkResponse()
  // @ApiBadRequestResponse()
  // async activeApplicationUser() {}

  @Post('verify-token')
  @HttpCode(203)
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  async activeApplicationUser(@Body() body: TokenDto) {
    await this.applicationUserService.verifyToken(body);
  }

  @Post('login')
  @UseGuards(IsAuthenticatedWithPublicKeyGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('PublicKey')
  async loginApplicationUser(
    @Request() request: Request,
    @Body() params: LoginDto,
  ) {
    // @ts-ignore
    const application = request.application;

    return await this.applicationUserService.loginApplicationUser(
      params,
      application,
    );
  }

  // @ApiOkResponse()
  // @ApiUnauthorizedResponse()
  // @Post('refresh')
  // async refreshToken() {
  //   //  TODO: Implement Refresh token endpoint
  // }
}
