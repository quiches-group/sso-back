import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../../config';
import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { ApplicationUserModule } from '../application-user/application-user.module';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUrl),
    UserModule,
    ApplicationUserModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
