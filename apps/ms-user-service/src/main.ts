import { createWinstonLogger } from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MsUserServiceModule } from './ms-user-service.module';

async function bootstrap() {
  const winstonLogger = createWinstonLogger('ms-user-service');

  const app = await NestFactory.createMicroservice(MsUserServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE_MS_USER_SERVICE || 'user_service_queue',
      queueOptions: {
        durable: true,
      },
    },
    logger: winstonLogger,
  });
  const logger = new Logger('MS-User-Service');
  await app.listen();

  logger.log('🟢 MS-User-Service is listening for messages...');
  logger.log('📂 Logs: ./logs/ms-user-service.log');
}

bootstrap();
