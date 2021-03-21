import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../../config';
import { UserAuthenticationModule } from '../user-authentication/user-authentication.module';
import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { ApplicationUserModule } from '../application-user/application-user.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUrl),
    UserAuthenticationModule,
    UserModule,
    ApplicationUserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
