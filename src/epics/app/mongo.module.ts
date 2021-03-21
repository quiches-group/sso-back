import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../models/refreshToken.model';
import {
  ApplicationUser,
  ApplicationUserSchema,
} from '../../models/applicationUser.model';
import { Application, ApplicationSchema } from '../../models/application.model';
import { UserRepository } from '../../repositories/user.repository';
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository';
import { ApplicationUserRepository } from '../../repositories/applicationUser.repository';
import { ApplicationRepository } from '../../repositories/application.repository';

@Module({
  imports: [
    NestMongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ApplicationUser.name, schema: ApplicationUserSchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),
  ],
  providers: [
    UserRepository,
    RefreshTokenRepository,
    ApplicationUserRepository,
    ApplicationRepository,
  ],
  exports: [
    UserRepository,
    RefreshTokenRepository,
    ApplicationUserRepository,
    ApplicationRepository,
  ],
})
export class MongoModule {}
