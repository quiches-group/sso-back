import { Module } from '@nestjs/common';
import { UserAuthenticationController } from './user-authentication.controller';
import { UserAuthenticationService } from './user-authentication.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MongoModule } from '../app/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [UserAuthenticationController],
  providers: [AuthenticationService, UserAuthenticationService],
})
export class UserAuthenticationModule {}
