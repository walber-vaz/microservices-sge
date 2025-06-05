import { NestFactory } from '@nestjs/core';
import { MsClientServiceModule } from './ms-client-service.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('MS-Client-Service');

  const app = await NestFactory.createMicroservice(MsClientServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue:
        process.env.RABBITMQ_QUEUE_MS_CLIENT_SERVICE || 'client_service_queue',
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
  logger.log('🔵 MS-Client-Service is listening for messages...');
}
bootstrap();
