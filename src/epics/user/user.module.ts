import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
import { UserRepository } from '../../repositories/user.repository';
import { AuthenticationService } from '../../services/authentication.service';
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../models/refreshToken.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    AuthenticationService,
    RefreshTokenRepository,
  ],
})
export class UserModule {}
