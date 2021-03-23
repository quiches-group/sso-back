import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../../config';
import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { ApplicationUserModule } from '../application-user/application-user.module';
import { ApplicationModule } from '../application/application.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RefreshTokenDeletionCron } from '../../crons/refresh-token-deletion.cron';
import { MongoModule } from './mongo.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUrl),
    UserModule,
    ApplicationUserModule,
    ApplicationModule,
    ScheduleModule.forRoot(),
    MongoModule,
  ],
  controllers: [AppController],
  providers: [RefreshTokenDeletionCron],
})
export class AppModule {}
