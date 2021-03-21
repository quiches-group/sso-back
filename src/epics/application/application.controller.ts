import {
  Body,
  Controller,
  HttpCode,
  Put,
  UseGuards,
  Request,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UserIsAuthenticatedGuard } from '../../guards/user-is-authenticated.guard';

@Controller('applications')
@ApiTags('Applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Put()
  @HttpCode(201)
  @UseGuards(UserIsAuthenticatedGuard)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('Bearer')
  async createApplication(
    @Request() request: Request,
    @Body() body: CreateApplicationDto,
  ) {
    // @ts-ignore
    const user = request.user;
    return this.applicationService.createApplication(body, user);
  }

  @Get('single/:privateKey/key')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getApplicationByPublicKey(@Param('privateKey') privateKey: string) {
    return this.applicationService.getApplicationByPrivateKey(privateKey);
  }

  @Get('/owned')
  @UseGuards(UserIsAuthenticatedGuard)
  @ApiSecurity('Bearer')
  @ApiOkResponse()
  getApplications(@Request() request: Request) {
    // @ts-ignore
    const user = request.user;

    return this.applicationService.getApplicationsOwnedByUser(user);
  }

  //  TODO: to implement
  // @Delete('single/:applicationId')
  // @HttpCode(204)
  // async deleteApplication(@Param('applicationId') applicationId: string) {
  //   await this.applicationService.removeApplication()
  // }
}
