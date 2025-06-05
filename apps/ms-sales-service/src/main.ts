import { NestFactory } from '@nestjs/core';
import { MsSalesServiceModule } from './ms-sales-service.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('MS-Sales-Service');

  const app = await NestFactory.createMicroservice(MsSalesServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue:
        process.env.RABBITMQ_QUEUE_MS_SALES_SERVICE || 'sales_service_queue',
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
  logger.log('🟠 MS-Sales-Service is listening for messages...');
}
bootstrap();
