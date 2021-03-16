import { Module } from '@nestjs/common';
import { UserAuthenticationController } from './user-authentication.controller';
import { UserAuthenticationService } from './user-authentication.service';
import { UserRepository } from '../../repositories/user.repository';
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
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
  controllers: [UserAuthenticationController],
  providers: [
    UserAuthenticationService,
    UserRepository,
    RefreshTokenRepository,
  ],
})
export class UserAuthenticationModule {}
