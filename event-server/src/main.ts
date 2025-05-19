import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Event Service API')
    .setDescription('The Event Service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'event-server',
      port: 3002,
    },
  });

  // Start microservice
  await app.startAllMicroservices();

  await app.listen(4002);

  console.log(`Event HTTP server is running on port 4002`);
  console.log(`Event microservice is running on port 3002`);
}
bootstrap();
