import { Module } from '@nestjs/common';
import { ApplicationUserController } from './application-user.controller';
import { ApplicationUserService } from './application-user.service';
import { MongoModule } from '../app/mongo.module';
import { AuthenticationService } from '../../services/authentication.service';

@Module({
  imports: [MongoModule],
  controllers: [ApplicationUserController],
  providers: [ApplicationUserService, AuthenticationService],
})
export class ApplicationUserModule {}
