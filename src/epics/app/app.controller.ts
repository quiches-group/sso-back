import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @ApiOperation({ summary: 'Get Application status. Used for monitoring' })
  @Get('status')
  getApplicationStatus() {
    const mongooseStatus = this.connection.readyState;

    const data = {
      'database-status': mongooseStatus === 1 ? 'up' : 'down',
    };

    if (mongooseStatus !== 1) {
      throw new HttpException(
        { ...data, statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data;
  }
}
