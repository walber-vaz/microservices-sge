import { createWinstonLogger } from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MsSalesServiceModule } from './ms-sales-service.module';

async function bootstrap() {
  const winstonLogger = createWinstonLogger('ms-sales-service');

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
    logger: winstonLogger,
  });
  const logger = new Logger('MS-Sales-Service');

  await app.listen();
  logger.log('🟠 MS-Sales-Service is listening for messages...');
  logger.log('📂 Logs: ./logs/ms-sales-service.log');
}
bootstrap();
