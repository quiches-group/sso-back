import {
  Body,
  Controller,
  HttpCode,
  Put,
  UseGuards,
  Request,
  Post,
  Get,
  Param,
  Query,
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
import { UserIsAuthenticatedGuard } from '../../guards/user-is-authenticated.guard';

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
  @ApiSecurity('Public Key')
  loginApplicationUser(@Request() request: Request, @Body() params: LoginDto) {
    // @ts-ignore
    const application = request.application;

    return this.applicationUserService.loginApplicationUser(
      params,
      application,
    );
  }

  @Post('sign-in-with-apple')
  @UseGuards(IsAuthenticatedWithPublicKeyGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Public Key')
  signInWithApple(@Request() request: Request, @Body() params: LoginDto) {
    // @ts-ignore
    const application = request.application;

    console.log(application, params);
  }

  @Get('application/:applicationId')
  @HttpCode(200)
  @UseGuards(UserIsAuthenticatedGuard)
  @ApiSecurity('Bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiQuery({ name: 'search', required: false })
  getApplicationUsersByApplicationId(
    @Param('applicationId') applicationId: string,
    @Query('search') search?: string,
  ) {
    return this.applicationUserService.getApplicationUsersByApplicationId(
      applicationId,
      search,
    );
  }

  // @ApiOkResponse()
  // @ApiUnauthorizedResponse()
  // @Post('refresh')
  // async refreshToken() {
  //   //  TODO: Implement Refresh token endpoint
  // }
}
