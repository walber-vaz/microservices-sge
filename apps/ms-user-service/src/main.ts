import { NestFactory } from '@nestjs/core';
import { MsUserServiceModule } from './ms-user-service.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('MS-User-Service');

  const app = await NestFactory.createMicroservice(MsUserServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE_MS_USER_SERVICE || 'user_service_queue',
      queueOptions: {
        durable: true,
      },
    },
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
  });
  await app.listen();
  logger.log('🟢 MS-User-Service is listening for messages...');
}

bootstrap();
