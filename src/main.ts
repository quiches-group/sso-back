import config from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './epics/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

const useSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Quiches SSO Documentation')
    .setDescription('The Quiches SSO offcial API documentation')
    .setVersion('1.0')
    .addSecurity('Bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addSecurity('Public Key', {
      in: 'query',
      type: 'apiKey',
      name: 'publicKey',
    })
    .addSecurity('Private Key', {
      in: 'query',
      type: 'apiKey',
      name: 'privateKey',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  useSwagger(app);
  await app.listen(config().port);
}
bootstrap();
