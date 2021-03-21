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
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserIsAuthenticatedGuard } from '../../guards/user-is-authenticated.guard';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(UserIsAuthenticatedGuard)
  // @ApiOperation({ summary: '' })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  getCurrentUser(@Request() req: Request) {
    // @ts-ignore
    return req.user;
  }

  @Put()
  @HttpCode(201)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async registerUser(@Body() body: RegisterDto) {
    await this.userService.registerUser(body);
  }

  //  TODO: Implement activation endpoint
  // @Post('activation')
  // @ApiOkResponse()
  // @ApiBadRequestResponse()
  // async activeUser() {}
}
