import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { MongoModule } from '../app/mongo.module';
import { AuthenticationService } from '../../services/authentication.service';

@Module({
  imports: [MongoModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, AuthenticationService],
})
export class ApplicationModule {}
