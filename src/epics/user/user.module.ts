import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MongoModule } from '../app/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [UserController],
  providers: [UserService, AuthenticationService],
})
export class UserModule {}
