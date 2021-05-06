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
import { ApplicationUsersIsAuthenticatedGuard } from '../../guards/application-users-is-authenticated.guard';
import { IsAuthenticatedWithPrivateKeyGuard } from '../../guards/is-authenticated-with-private-key.guard';
import { RefreshTokenDto } from '../user/dto/refresh-token.dto';

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

  @Post('refresh-token')
  @UseGuards(IsAuthenticatedWithPublicKeyGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Public Key')
  async refreshToken(
    @Request() request: Request,
    @Body() body: RefreshTokenDto,
  ) {
    // @ts-ignore
    const application = request.application;

    return this.applicationUserService.refreshTokenApplicationUser(
      body,
      application,
    );
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

  @Get('private-key')
  @HttpCode(200)
  @UseGuards(IsAuthenticatedWithPrivateKeyGuard)
  @ApiSecurity('Private Key')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiQuery({ name: 'search', required: false })
  getApplicationUsers(
    @Request() req: Request,
    @Query('search') search?: string,
  ) {
    // @ts-ignore
    const applicationId = req.application._id;
    return this.applicationUserService.getApplicationUsersByApplicationId(
      applicationId,
      search,
    );
  }

  @Get('current')
  @UseGuards(ApplicationUsersIsAuthenticatedGuard)
  // @ApiOperation({ summary: '' })
  @ApiSecurity('Bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  getCurrentUser(@Request() req: Request) {
    // @ts-ignore
    return req.user;
  }

  // @ApiOkResponse()
  // @ApiUnauthorizedResponse()
  // @Post('refresh')
  // async refreshToken() {
  //   //  TODO: Implement Refresh token endpoint
  // }
}
