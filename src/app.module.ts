import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config';
import { User, UserSchema } from './models/user.model';
import { Application, ApplicationSchema } from './models/application.model';
import {
  ApplicationUser,
  ApplicationUserSchema,
} from './models/applicationUser.model';
import { RefreshToken, RefreshTokenSchema } from './models/refreshToken.model';
import { UserRepository } from './repositories/user.repository';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationUserRepository } from './repositories/applicationUser.repository';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
import { UserAuthenticationModule } from './epics/user-authentication/user-authentication.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUrl),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: ApplicationUser.name, schema: ApplicationUserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    UserAuthenticationModule,
  ],
  controllers: [],
  providers: [
    UserRepository,
    ApplicationRepository,
    ApplicationUserRepository,
    RefreshTokenRepository,
  ],
})
export class AppModule {}
